using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Web_NoiThat.Server.Data;
using Web_NoiThat.Server.DTOs;
using Web_NoiThat.Server.Models;
using Web_NoiThat.Server.Services;
using Microsoft.EntityFrameworkCore;

namespace Web_NoiThat.Server.Controllers;

/// <summary>
/// POST /api/orders            - Tạo đơn hàng (trừ kho Redis + tạo VNPay URL)
/// GET  /api/orders/my         - Đơn hàng của user hiện tại
/// GET  /api/orders/{id}       - Chi tiết đơn hàng
/// GET  /api/orders            - Admin: tất cả đơn hàng
/// PUT  /api/orders/{id}/status - Admin: cập nhật trạng thái
/// POST /api/orders/vnpay-ipn  - VNPay IPN webhook (verify HMAC)
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IInventoryService _inventory;
    private readonly IVnPayService _vnpay;
    private readonly ILogger<OrdersController> _logger;
    private readonly IHostEnvironment _environment;

    public OrdersController(AppDbContext db, IInventoryService inventory, IVnPayService vnpay, ILogger<OrdersController> logger, IHostEnvironment environment)
    {
        _db = db;
        _inventory = inventory;
        _vnpay = vnpay;
        _logger = logger;
        _environment = environment;
    }

    private static string? NormalizePaymentMethod(string? paymentMethod) =>
        paymentMethod?.Trim().ToLowerInvariant() switch
        {
            "vnpay" => "VNPay",
            "qr" => "QR",
            "cod" => "COD",
            _ => null
        };

    // POST /api/orders — Tạo đơn hàng (trừ kho atomic + VNPay URL)
    [HttpPost]
    [EnableRateLimiting("OrderLimit")]
    public async Task<ActionResult<object>> CreateOrder([FromBody] CreateOrderRequest req)
    {
        if (req is null)
            return BadRequest(new { message = "Dữ liệu đơn hàng không hợp lệ." });

        if (req.Items is null || !req.Items.Any())
            return BadRequest(new { message = "Giỏ hàng trống." });

        if (string.IsNullOrWhiteSpace(req.ReceiverName) ||
            string.IsNullOrWhiteSpace(req.ReceiverPhone) ||
            string.IsNullOrWhiteSpace(req.ReceiverAddress))
        {
            return BadRequest(new { message = "Vui lòng điền đầy đủ thông tin nhận hàng." });
        }

        var paymentMethod = NormalizePaymentMethod(req.PaymentMethod);
        if (paymentMethod is null)
            return BadRequest(new { message = "Phương thức thanh toán không hợp lệ." });

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var stockDecremented = false;
        var stockItems = req.Items.Select(i => (i.ProductId, i.Quantity)).ToList();

        try
        {
            // ── Trừ kho qua Redis (atomic Lua Script) ──
            _logger.LogInformation("[Redis] Trừ kho cho {Count} sản phẩm: {Items}",
                stockItems.Count, string.Join(", ", stockItems.Select(s => $"P{s.ProductId}x{s.Quantity}")));

            var outOfStock = await _inventory.DecrementStockAsync(stockItems);

            if (outOfStock.Any())
            {
                _logger.LogWarning("[Redis] Hết hàng ProductIds: {Ids}", string.Join(", ", outOfStock));
                var names = await _db.Products
                    .Where(p => outOfStock.Contains(p.Id))
                    .Select(p => p.Name).ToListAsync();
                return Conflict(new { message = $"Hết hàng: {string.Join(", ", names)}" });
            }
            stockDecremented = true;
            _logger.LogInformation("[Redis] Trừ kho thành công");

            // ── Tính giá: Nhận diện Flash Sale ──
            var nowVn = DateTime.UtcNow.AddHours(7);
            var nowUtc = DateTime.UtcNow;

            // Load tất cả Flash Sale items đang active cho các sản phẩm trong đơn
            var productIds = req.Items.Select(i => i.ProductId).ToList();
            var activeFlashItems = await _db.FlashSaleItems
                .Include(fi => fi.FlashSale)
                .Where(fi => fi.FlashSale.IsActive
                    && productIds.Contains(fi.ProductId)
                    && ((fi.FlashSale.StartAt <= nowVn && fi.FlashSale.EndAt >= nowVn)
                        || (fi.FlashSale.StartAt <= nowUtc && fi.FlashSale.EndAt >= nowUtc)))
                .ToListAsync();

            // Build danh sách OrderItems với giá chính xác
            var orderItems = new List<OrderItem>();
            var flashSaleUpdates = new List<(int FlashSaleItemId, int Qty)>();
            decimal totalAmount = 0;

            foreach (var item in req.Items)
            {
                // Tìm flash sale item cho product này
                var flashItem = activeFlashItems.FirstOrDefault(fi =>
                    fi.ProductId == item.ProductId
                    && (fi.StockLimit == null || fi.SoldQuantity + item.Quantity <= fi.StockLimit));

                decimal unitPrice;
                if (flashItem != null)
                {
                    unitPrice = flashItem.SalePrice;
                    flashSaleUpdates.Add((flashItem.Id, item.Quantity));
                    _logger.LogInformation("[FlashSale] Product {Id}: giá gốc {Original} → giá sale {Sale}",
                        item.ProductId, item.UnitPrice, unitPrice);
                }
                else
                {
                    unitPrice = item.UnitPrice; // Giá gốc từ frontend
                    _logger.LogInformation("[FlashSale] Product {Id}: không có flash sale, dùng giá gốc {Price}",
                        item.ProductId, unitPrice);
                }

                totalAmount += unitPrice * item.Quantity;
                orderItems.Add(new OrderItem
                {
                    ProductId   = item.ProductId,
                    ProductName = item.ProductName,
                    UnitPrice   = unitPrice,
                    Quantity    = item.Quantity,
                });
            }

            decimal discountAmount = 0;

            // Validate voucher
            if (!string.IsNullOrEmpty(req.VoucherCode))
            {
                var voucher = await _db.Vouchers.FirstOrDefaultAsync(v =>
                    v.Code == req.VoucherCode && v.IsActive &&
                    (v.ExpiresAt == null || v.ExpiresAt > DateTime.UtcNow) &&
                    (v.MaxUsageCount == null || v.UsedCount < v.MaxUsageCount));

                if (voucher != null && (voucher.MinOrderAmount == null || totalAmount >= voucher.MinOrderAmount))
                {
                    discountAmount = totalAmount * (voucher.DiscountPercent / 100m);
                    if (voucher.MaxDiscountAmount.HasValue && discountAmount > voucher.MaxDiscountAmount)
                        discountAmount = voucher.MaxDiscountAmount.Value;

                    voucher.UsedCount++;
                }
            }

            var finalAmount = totalAmount - discountAmount;

            // Tạo mã đơn hàng
            var orderCode = $"ORD-{DateTime.UtcNow:yyyyMMdd}-{new Random().Next(1000, 9999)}";

            var order = new Order
            {
                OrderCode       = orderCode,
                UserId          = userId,
                Type            = (Models.OrderType)(int)req.Type,
                Status          = Models.OrderStatus.Pending,
                ReceiverName    = req.ReceiverName,
                ReceiverPhone   = req.ReceiverPhone,
                ReceiverAddress = req.ReceiverAddress,
                TotalAmount     = totalAmount,
                DiscountAmount  = discountAmount,
                FinalAmount     = finalAmount,
                PaymentMethod   = paymentMethod,
                VoucherId       = req.VoucherCode,
                IsPaid          = false,
                CreatedAt       = DateTime.UtcNow,
                Items           = orderItems,
            };

            _db.Orders.Add(order);
            await _db.SaveChangesAsync();

            // Đồng bộ stock xuống SQL Server (dùng ExecuteUpdateAsync tránh EF tracking conflict)
            foreach (var item in req.Items)
            {
                var updated = await _db.Products
                    .Where(p => p.Id == item.ProductId)
                    .ExecuteUpdateAsync(s => s
                        .SetProperty(p => p.Stock, p => p.Stock - item.Quantity)
                        .SetProperty(p => p.SoldCount, p => p.SoldCount + item.Quantity));

                _logger.LogInformation("[SQL] Product {Id}: Stock -= {Qty}, SoldCount += {Qty}, Rows={Rows}",
                    item.ProductId, item.Quantity, item.Quantity, updated);
            }

            // Cập nhật SoldQuantity cho Flash Sale items
            foreach (var (flashSaleItemId, qty) in flashSaleUpdates)
            {
                await _db.FlashSaleItems
                    .Where(fi => fi.Id == flashSaleItemId)
                    .ExecuteUpdateAsync(s => s
                        .SetProperty(fi => fi.SoldQuantity, fi => fi.SoldQuantity + qty));

                _logger.LogInformation("[FlashSale] FlashSaleItem {Id}: SoldQuantity += {Qty}", flashSaleItemId, qty);
            }

            var summary = new OrderSummaryDto(
                order.Id, order.OrderCode,
                order.Status.ToString(), order.FinalAmount, order.PaymentMethod,
                order.IsPaid, order.CreatedAt);

            string? paymentUrl = null;
            if (paymentMethod == "VNPay")
            {
                var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";
                paymentUrl = _vnpay.CreatePaymentUrl(
                    order.OrderCode,
                    order.FinalAmount,
                    $"Thanh toan don hang {order.OrderCode}",
                    ipAddress);
            }

            _logger.LogInformation("Đơn hàng {OrderCode} tạo thành công, FinalAmount={Amount}", orderCode, finalAmount);

            return Ok(new { orderSummary = summary, paymentUrl });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi tạo đơn hàng");

            // Nếu đã trừ kho Redis → hoàn trả
            if (stockDecremented)
            {
                try { await _inventory.RestoreStockAsync(stockItems); }
                catch (Exception restoreEx) { _logger.LogError(restoreEx, "Lỗi khi hoàn trả stock Redis"); }
            }

            if (_environment.IsDevelopment())
            {
                return StatusCode(500, new
                {
                    message = "Lỗi hệ thống khi tạo đơn hàng. Vui lòng thử lại.",
                    details = ex.Message,
                    inner = ex.InnerException?.Message
                });
            }

            return StatusCode(500, new { message = "Lỗi hệ thống khi tạo đơn hàng. Vui lòng thử lại." });
        }
    }

    // GET /api/orders/my — Đơn hàng của user đã đăng nhập
    [HttpGet("my")]
    [Authorize]
    public async Task<ActionResult<IEnumerable<OrderSummaryDto>>> GetMyOrders()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var orders = await _db.Orders
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new OrderSummaryDto(
                o.Id, o.OrderCode, o.Status.ToString(),
                o.FinalAmount, o.PaymentMethod, o.IsPaid, o.CreatedAt))
            .ToListAsync();

        return Ok(orders);
    }

    // GET /api/orders/{id}
    [HttpGet("{id:int}")]
    [Authorize]
    public async Task<ActionResult<OrderDetailDto>> GetOrder(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var isAdmin = User.IsInRole("Admin");

        var order = await _db.Orders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == id && (isAdmin || o.UserId == userId));

        if (order is null) return NotFound();

        var dto = new OrderDetailDto(
            order.Id, order.OrderCode, order.Status.ToString(),
            order.ReceiverName, order.ReceiverPhone, order.ReceiverAddress,
            order.TotalAmount, order.DiscountAmount, order.FinalAmount,
            order.PaymentMethod,
            order.IsPaid, order.VnpayTransactionId,
            order.Items.Select(i => new CartItemDto(
                i.ProductId, i.ProductName, "", i.UnitPrice, i.Quantity)),
            order.CreatedAt);

        return Ok(dto);
    }

    // GET /api/orders — Admin: danh sách tất cả đơn hàng
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<object>> GetAllOrders(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? status = null)
    {
        var query = _db.Orders
            .Include(o => o.Items)
            .AsQueryable();

        if (!string.IsNullOrEmpty(status) && Enum.TryParse<Models.OrderStatus>(status, out var st))
            query = query.Where(o => o.Status == st);

        var total = await query.CountAsync();
        var items = await query
            .OrderByDescending(o => o.CreatedAt)
            .Skip((page - 1) * pageSize).Take(pageSize)
            .Select(o => new
            {
                o.Id, o.OrderCode,
                Status = o.Status.ToString(),
                o.ReceiverName, o.ReceiverPhone,
                o.FinalAmount, o.PaymentMethod, o.IsPaid, o.CreatedAt
            })
            .ToListAsync();

        return Ok(new { Total = total, Page = page, PageSize = pageSize, Items = items });
    }

    // PUT /api/orders/{id}/status — Admin: cập nhật trạng thái
    [HttpPut("{id:int}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> UpdateStatus(int id, [FromBody] UpdateOrderStatusRequest req)
    {
        var order = await _db.Orders.FindAsync(id);
        if (order is null) return NotFound();

        if (!Enum.TryParse<Models.OrderStatus>(req.Status, out var newStatus))
            return BadRequest(new { message = "Trạng thái không hợp lệ." });

        order.Status = newStatus;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    // POST /api/orders/vnpay-ipn — VNPay IPN webhook (verify HMAC SHA-512)
    [HttpPost("vnpay-ipn")]
    [AllowAnonymous]
    public async Task<IActionResult> VnpayIpn()
    {
        // 1. Verify HMAC signature
        if (!_vnpay.ValidateIpnSignature(Request.Query))
            return Ok(new { RspCode = "97", Message = "Invalid signature" });

        var txnRef       = Request.Query["vnp_TxnRef"].ToString();
        var responseCode = Request.Query["vnp_ResponseCode"].ToString();
        var transactionNo = Request.Query["vnp_TransactionNo"].ToString();

        var order = await _db.Orders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.OrderCode == txnRef);

        if (order is null)
            return Ok(new { RspCode = "01", Message = "Order not found" });

        if (order.IsPaid)
            return Ok(new { RspCode = "02", Message = "Already paid" });

        if (responseCode == "00")
        {
            // Thanh toán thành công
            order.IsPaid              = true;
            order.PaidAt              = DateTime.UtcNow;
            order.VnpayTransactionId  = transactionNo;
            order.Status              = Models.OrderStatus.Processing;
            await _db.SaveChangesAsync();
        }
        else
        {
            // Thanh toán thất bại → hoàn trả stock
            var orderItems = order.Items
                .Select(i => (i.ProductId, i.Quantity))
                .ToList();

            await _inventory.RestoreStockAsync(orderItems);

            // Cập nhật SQL stock
            foreach (var item in order.Items)
            {
                var product = await _db.Products.FindAsync(item.ProductId);
                if (product != null)
                {
                    product.Stock += item.Quantity;
                    product.SoldCount -= item.Quantity;
                }
            }

            order.Status = Models.OrderStatus.Cancelled;
            await _db.SaveChangesAsync();
        }

        return Ok(new { RspCode = "00", Message = "Confirm success" });
    }
}

public record UpdateOrderStatusRequest(string Status);

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Web_NoiThat.Server.Data;
using Web_NoiThat.Server.Models;

namespace Web_NoiThat.Server.Controllers;

/// <summary>
/// API quản trị Flash Sale (Admin only)
/// POST   /api/admin/flash-sales         — Tạo chiến dịch
/// PUT    /api/admin/flash-sales/{id}     — Cập nhật
/// DELETE /api/admin/flash-sales/{id}     — Xóa / kết thúc sớm
/// GET    /api/admin/flash-sales          — Danh sách tất cả
/// </summary>
[ApiController]
[Route("api/admin/flash-sales")]
[Authorize(Roles = "Admin")]
public class AdminFlashSaleController : ControllerBase
{
    private readonly AppDbContext _db;
    public AdminFlashSaleController(AppDbContext db) => _db = db;

    // ── DTOs ──
    public record CreateFlashSaleRequest(
        string Name, DateTime StartAt, DateTime EndAt,
        List<FlashSaleItemRequest> Items);

    public record UpdateFlashSaleRequest(
        string? Name, DateTime? StartAt, DateTime? EndAt, bool? IsActive,
        List<FlashSaleItemRequest>? Items);

    public record FlashSaleItemRequest(
        int ProductId, decimal SalePrice, int? StockLimit);

    // GET /api/admin/flash-sales
    [HttpGet]
    public async Task<ActionResult> GetAll()
    {
        var sales = await _db.FlashSales
            .Include(f => f.Items).ThenInclude(i => i.Product)
            .OrderByDescending(f => f.StartAt)
            .Select(f => new
            {
                f.Id, f.Name, f.StartAt, f.EndAt, f.IsActive,
                ItemCount = f.Items.Count,
                Items = f.Items.Select(i => new
                {
                    i.Id, i.ProductId,
                    ProductName = i.Product.Name,
                    i.SalePrice, i.StockLimit, i.SoldQuantity
                })
            })
            .ToListAsync();

        return Ok(sales);
    }

    // POST /api/admin/flash-sales
    [HttpPost]
    public async Task<ActionResult> Create([FromBody] CreateFlashSaleRequest req)
    {
        if (!req.Items.Any())
            return BadRequest(new { message = "Cần ít nhất 1 sản phẩm." });

        var sale = new FlashSale
        {
            Name    = req.Name,
            StartAt = req.StartAt,
            EndAt   = req.EndAt,
            IsActive = true,
            Items = req.Items.Select(i => new FlashSaleItem
            {
                ProductId    = i.ProductId,
                SalePrice    = i.SalePrice,
                StockLimit   = i.StockLimit,
                SoldQuantity = 0,
            }).ToList(),
        };

        _db.FlashSales.Add(sale);
        await _db.SaveChangesAsync();

        return Ok(new { message = "Tạo Flash Sale thành công.", id = sale.Id });
    }

    // PUT /api/admin/flash-sales/{id}
    [HttpPut("{id:int}")]
    public async Task<ActionResult> Update(int id, [FromBody] UpdateFlashSaleRequest req)
    {
        var sale = await _db.FlashSales.Include(f => f.Items).FirstOrDefaultAsync(f => f.Id == id);
        if (sale is null) return NotFound();

        if (req.Name != null) sale.Name = req.Name;
        if (req.StartAt.HasValue) sale.StartAt = req.StartAt.Value;
        if (req.EndAt.HasValue) sale.EndAt = req.EndAt.Value;
        if (req.IsActive.HasValue) sale.IsActive = req.IsActive.Value;

        // Nếu có danh sách items mới → replace toàn bộ
        if (req.Items != null)
        {
            _db.FlashSaleItems.RemoveRange(sale.Items);
            sale.Items = req.Items.Select(i => new FlashSaleItem
            {
                ProductId    = i.ProductId,
                SalePrice    = i.SalePrice,
                StockLimit   = i.StockLimit,
                SoldQuantity = 0,
            }).ToList();
        }

        await _db.SaveChangesAsync();
        return Ok(new { message = "Cập nhật Flash Sale thành công." });
    }

    // DELETE /api/admin/flash-sales/{id}
    [HttpDelete("{id:int}")]
    public async Task<ActionResult> Delete(int id)
    {
        var sale = await _db.FlashSales.Include(f => f.Items).FirstOrDefaultAsync(f => f.Id == id);
        if (sale is null) return NotFound();

        _db.FlashSaleItems.RemoveRange(sale.Items);
        _db.FlashSales.Remove(sale);
        await _db.SaveChangesAsync();

        return Ok(new { message = "Đã xóa Flash Sale." });
    }
}

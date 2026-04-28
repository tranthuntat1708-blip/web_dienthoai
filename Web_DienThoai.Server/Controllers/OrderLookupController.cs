using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Web_NoiThat.Server.Data;
using Web_NoiThat.Server.DTOs;

namespace Web_NoiThat.Server.Controllers;

[ApiController]
[Route("api/orders")]
public class OrderLookupController : ControllerBase
{
    private readonly AppDbContext _db;

    public OrderLookupController(AppDbContext db) => _db = db;

    [HttpGet("lookup")]
    public async Task<ActionResult<OrderDetailDto>> Lookup([FromQuery] string orderCode, [FromQuery] string phone)
    {
        if (string.IsNullOrWhiteSpace(orderCode) || string.IsNullOrWhiteSpace(phone))
        {
            return BadRequest(new { message = "Vui lòng nhập mã đơn hàng và số điện thoại." });
        }

        var normalizedPhone = NormalizePhone(phone);
        var normalizedCode = orderCode.Trim().ToUpperInvariant();

        var order = _db.Orders
            .Include(o => o.Items)
            .Where(o => o.OrderCode.ToUpper() == normalizedCode)
            .AsEnumerable()
            .FirstOrDefault(o => NormalizePhone(o.ReceiverPhone) == normalizedPhone);

        if (order is null)
        {
            return NotFound(new { message = "Không tìm thấy đơn hàng phù hợp." });
        }

        var dto = new OrderDetailDto(
            order.Id,
            order.OrderCode,
            order.Status.ToString(),
            order.ReceiverName,
            order.ReceiverPhone,
            order.ReceiverAddress,
            order.TotalAmount,
            order.DiscountAmount,
            order.FinalAmount,
            order.PaymentMethod,
            order.IsPaid,
            order.VnpayTransactionId,
            order.Items.Select(i => new CartItemDto(i.ProductId, i.ProductName, string.Empty, i.UnitPrice, i.Quantity)),
            order.CreatedAt);

        return Ok(dto);
    }

    private static string NormalizePhone(string input) =>
        new(input.Where(char.IsDigit).ToArray());
}

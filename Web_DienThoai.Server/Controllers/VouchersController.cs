using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Web_NoiThat.Server.Data;
using Web_NoiThat.Server.DTOs;

namespace Web_NoiThat.Server.Controllers;

/// <summary>
/// GET  /api/vouchers              — Danh sách voucher công khai (active, chưa hết hạn)
/// POST /api/vouchers/validate     — Kiểm tra voucher hợp lệ + tính số tiền giảm
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class VouchersController : ControllerBase
{
    private readonly AppDbContext _db;
    public VouchersController(AppDbContext db) => _db = db;

    // GET /api/vouchers
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PublicVoucherDto>>> GetPublic()
    {
        var now = DateTime.UtcNow;
        var vouchers = await _db.Vouchers
            .Where(v => v.IsActive
                && (v.ExpiresAt == null || v.ExpiresAt > now)
                && (v.MaxUsageCount == null || v.UsedCount < v.MaxUsageCount))
            .OrderBy(v => v.Id)
            .Select(v => new PublicVoucherDto(
                v.Code,
                v.DiscountPercent,
                v.MaxDiscountAmount,
                v.MinOrderAmount,
                v.ExpiresAt))
            .ToListAsync();

        return Ok(vouchers);
    }

    // POST /api/vouchers/validate
    [HttpPost("validate")]
    public async Task<ActionResult<VoucherValidationResult>> Validate(
        [FromBody] ValidateVoucherRequest req)
    {
        var voucher = await _db.Vouchers.FirstOrDefaultAsync(v =>
            v.Code == req.Code && v.IsActive &&
            (v.ExpiresAt == null || v.ExpiresAt > DateTime.UtcNow) &&
            (v.MaxUsageCount == null || v.UsedCount < v.MaxUsageCount));

        if (voucher is null)
            return Ok(new VoucherValidationResult(false, 0, "Mã giảm giá không hợp lệ hoặc đã hết hạn."));

        if (voucher.MinOrderAmount.HasValue && req.OrderAmount < voucher.MinOrderAmount)
            return Ok(new VoucherValidationResult(false, 0,
                $"Đơn hàng tối thiểu {voucher.MinOrderAmount:N0}đ để dùng mã này."));

        var discount = req.OrderAmount * (voucher.DiscountPercent / 100m);
        if (voucher.MaxDiscountAmount.HasValue && discount > voucher.MaxDiscountAmount)
            discount = voucher.MaxDiscountAmount.Value;

        return Ok(new VoucherValidationResult(true, discount, null));
    }
}

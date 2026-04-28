using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Web_NoiThat.Server.Data;

namespace Web_NoiThat.Server.Controllers;

/// <summary>
/// GET /api/flash-sale/active — Flash sale đang diễn ra (nếu có)
/// </summary>
[ApiController]
[Route("api/flash-sale")]
public class FlashSaleController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly ILogger<FlashSaleController> _logger;

    public FlashSaleController(AppDbContext db, ILogger<FlashSaleController> logger)
    {
        _db = db;
        _logger = logger;
    }

    public record FlashSaleDto(
        int Id, string Name, DateTime StartAt, DateTime EndAt,
        IEnumerable<FlashSaleItemDto> Items);

    public record FlashSaleItemDto(
        int ProductId, string ProductName, string ProductSlug,
        string MainImageUrl, decimal OriginalPrice, decimal SalePrice,
        int? StockLimit, double? AverageRating, int ReviewCount, int SoldCount);

    // GET /api/flash-sale/active
    [HttpGet("active")]
    public async Task<ActionResult<FlashSaleDto>> GetActive()
    {
        // Dùng cả UTC và giờ VN để đảm bảo match dù data lưu kiểu nào
        var nowUtc = DateTime.UtcNow;
        var nowVn = nowUtc.AddHours(7);

        _logger.LogInformation("[FlashSale] Checking active sale. UTC={Utc}, VN={Vn}", nowUtc, nowVn);

        // Thử tìm với giờ VN trước (vì DbSeeder thường dùng DateTime.Now là giờ local)
        var sale = await _db.FlashSales
            .Include(f => f.Items)
                .ThenInclude(i => i.Product)
                    .ThenInclude(p => p.Reviews)
            .Where(f => f.IsActive && f.StartAt <= nowVn && f.EndAt >= nowVn)
            .OrderByDescending(f => f.StartAt)
            .FirstOrDefaultAsync();

        // Fallback: thử UTC
        if (sale is null)
        {
            sale = await _db.FlashSales
                .Include(f => f.Items)
                    .ThenInclude(i => i.Product)
                        .ThenInclude(p => p.Reviews)
                .Where(f => f.IsActive && f.StartAt <= nowUtc && f.EndAt >= nowUtc)
                .OrderByDescending(f => f.StartAt)
                .FirstOrDefaultAsync();
        }

        if (sale is null)
        {
            // Log tất cả flash sales trong DB để debug
            var allSales = await _db.FlashSales
                .Select(f => new { f.Id, f.Name, f.IsActive, f.StartAt, f.EndAt })
                .ToListAsync();
            _logger.LogWarning("[FlashSale] Không tìm thấy flash sale active. Tất cả sales trong DB: {Sales}",
                string.Join(" | ", allSales.Select(s => $"[{s.Id}] {s.Name} Active={s.IsActive} {s.StartAt:yyyy-MM-dd HH:mm} → {s.EndAt:yyyy-MM-dd HH:mm}")));

            return NotFound(new { message = "Không có flash sale nào đang diễn ra." });
        }

        _logger.LogInformation("[FlashSale] Tìm thấy: [{Id}] {Name}, {Start} → {End}",
            sale.Id, sale.Name, sale.StartAt, sale.EndAt);

        var dto = new FlashSaleDto(
            sale.Id, sale.Name, sale.StartAt, sale.EndAt,
            sale.Items
                .Where(i => i.Product.IsActive)
                .Select(i => new FlashSaleItemDto(
                    i.ProductId,
                    i.Product.Name,
                    i.Product.Slug,
                    i.Product.MainImageUrl,
                    i.Product.Price,
                    i.SalePrice,
                    i.StockLimit,
                    i.Product.Reviews.Any() ? i.Product.Reviews.Average(r => (double)r.Rating) : null,
                    i.Product.Reviews.Count,
                    i.Product.SoldCount)));

        return Ok(dto);
    }
}

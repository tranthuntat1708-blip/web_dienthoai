using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Web_NoiThat.Server.Data;
using Web_NoiThat.Server.DTOs;
using Web_NoiThat.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Web_NoiThat.Server.Controllers;

/// <summary>
/// GET    /api/wishlist          - Lấy danh sách yêu thích của user
/// POST   /api/wishlist/{productId}  - Thêm sản phẩm vào yêu thích
/// DELETE /api/wishlist/{productId}  - Xóa sản phẩm khỏi yêu thích
/// GET    /api/wishlist/check/{productId} - Kiểm tra sản phẩm đã yêu thích chưa
/// GET    /api/wishlist/ids       - Lấy danh sách productId đã yêu thích
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class WishlistController : ControllerBase
{
    private readonly AppDbContext _db;
    public WishlistController(AppDbContext db) => _db = db;

    private string GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    // GET /api/wishlist — Danh sách yêu thích (có thông tin sản phẩm)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<WishlistItemDto>>> GetWishlist()
    {
        var userId = GetUserId();

        var items = await _db.WishlistItems
            .Where(w => w.UserId == userId)
            .Include(w => w.Product)
                .ThenInclude(p => p.Category)
            .OrderByDescending(w => w.AddedAt)
            .Select(w => new WishlistItemDto(
                w.Id,
                w.ProductId,
                w.Product.Name,
                w.Product.Slug,
                w.Product.MainImageUrl,
                w.Product.Price,
                w.Product.SalePrice,
                w.Product.IsOnSale,
                w.Product.Stock,
                w.Product.Category != null ? w.Product.Category.Name : null,
                w.AddedAt
            ))
            .ToListAsync();

        return Ok(items);
    }

    // GET /api/wishlist/ids — Chỉ trả về danh sách productId (dùng cho UI check nhanh)
    [HttpGet("ids")]
    public async Task<ActionResult<IEnumerable<int>>> GetWishlistIds()
    {
        var userId = GetUserId();

        var ids = await _db.WishlistItems
            .Where(w => w.UserId == userId)
            .Select(w => w.ProductId)
            .ToListAsync();

        return Ok(ids);
    }

    // GET /api/wishlist/check/{productId} — Kiểm tra sản phẩm đã có trong wishlist chưa
    [HttpGet("check/{productId:int}")]
    public async Task<ActionResult<object>> CheckWishlist(int productId)
    {
        var userId = GetUserId();

        var exists = await _db.WishlistItems
            .AnyAsync(w => w.UserId == userId && w.ProductId == productId);

        return Ok(new { isInWishlist = exists });
    }

    // POST /api/wishlist/{productId} — Thêm vào yêu thích
    [HttpPost("{productId:int}")]
    public async Task<ActionResult<object>> AddToWishlist(int productId)
    {
        var userId = GetUserId();

        // Kiểm tra sản phẩm tồn tại
        var productExists = await _db.Products.AnyAsync(p => p.Id == productId);
        if (!productExists)
            return NotFound(new { message = "Sản phẩm không tồn tại." });

        // Kiểm tra đã có trong wishlist chưa
        var exists = await _db.WishlistItems
            .AnyAsync(w => w.UserId == userId && w.ProductId == productId);

        if (exists)
            return Ok(new { message = "Sản phẩm đã có trong danh sách yêu thích.", alreadyExists = true });

        var item = new WishlistItem
        {
            UserId = userId,
            ProductId = productId,
            AddedAt = DateTime.UtcNow,
        };

        _db.WishlistItems.Add(item);
        await _db.SaveChangesAsync();

        return Ok(new { message = "Đã thêm vào danh sách yêu thích!", id = item.Id });
    }

    // DELETE /api/wishlist/{productId} — Xóa khỏi yêu thích
    [HttpDelete("{productId:int}")]
    public async Task<ActionResult> RemoveFromWishlist(int productId)
    {
        var userId = GetUserId();

        var item = await _db.WishlistItems
            .FirstOrDefaultAsync(w => w.UserId == userId && w.ProductId == productId);

        if (item is null)
            return NotFound(new { message = "Sản phẩm không có trong danh sách yêu thích." });

        _db.WishlistItems.Remove(item);
        await _db.SaveChangesAsync();

        return Ok(new { message = "Đã xóa khỏi danh sách yêu thích." });
    }

    // POST /api/wishlist/toggle/{productId} — Toggle yêu thích (thêm nếu chưa có, xóa nếu đã có)
    [HttpPost("toggle/{productId:int}")]
    public async Task<ActionResult<object>> ToggleWishlist(int productId)
    {
        var userId = GetUserId();

        // Kiểm tra sản phẩm tồn tại
        var productExists = await _db.Products.AnyAsync(p => p.Id == productId);
        if (!productExists)
            return NotFound(new { message = "Sản phẩm không tồn tại." });

        var existing = await _db.WishlistItems
            .FirstOrDefaultAsync(w => w.UserId == userId && w.ProductId == productId);

        if (existing is not null)
        {
            _db.WishlistItems.Remove(existing);
            await _db.SaveChangesAsync();
            return Ok(new { isInWishlist = false, message = "Đã xóa khỏi danh sách yêu thích." });
        }

        var item = new WishlistItem
        {
            UserId = userId,
            ProductId = productId,
            AddedAt = DateTime.UtcNow,
        };

        _db.WishlistItems.Add(item);
        await _db.SaveChangesAsync();

        return Ok(new { isInWishlist = true, message = "Đã thêm vào danh sách yêu thích!" });
    }
}

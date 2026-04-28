using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Web_NoiThat.Server.Data;
using Web_NoiThat.Server.DTOs;
using Web_NoiThat.Server.Models;

namespace Web_NoiThat.Server.Controllers;

[ApiController]
[Route("api")]
public class ReviewsController : ControllerBase
{
    private readonly AppDbContext _db;

    public ReviewsController(AppDbContext db) => _db = db;

    [HttpPost("products/{productId:int}/reviews")]
    [Authorize]
    public async Task<ActionResult> CreateProductReview(int productId, [FromBody] CreateReviewRequest request)
    {
        if (productId != request.ProductId)
        {
            return BadRequest(new { message = "Sản phẩm đánh giá không hợp lệ." });
        }

        if (request.Rating is < 1 or > 5 || string.IsNullOrWhiteSpace(request.Comment))
        {
            return BadRequest(new { message = "Vui lòng nhập số sao và nội dung đánh giá hợp lệ." });
        }

        var product = await _db.Products.FirstOrDefaultAsync(p => p.Id == productId && p.IsActive);
        if (product is null)
        {
            return NotFound(new { message = "Không tìm thấy sản phẩm." });
        }

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized();
        }

        var existingReview = await _db.Reviews.FirstOrDefaultAsync(r => r.ProductId == productId && r.UserId == userId);
        if (existingReview is not null)
        {
            return Conflict(new { message = "Bạn đã gửi đánh giá cho sản phẩm này rồi." });
        }

        var review = new Review
        {
            ProductId = productId,
            UserId = userId,
            Rating = request.Rating,
            Comment = request.Comment.Trim(),
            IsApproved = false,
            CreatedAt = DateTime.UtcNow,
            Images = (request.ImageBase64List ?? [])
                .Where(image => !string.IsNullOrWhiteSpace(image))
                .Take(4)
                .Select(image => new ReviewImage { Url = image.Trim() })
                .ToList()
        };

        _db.Reviews.Add(review);
        await _db.SaveChangesAsync();

        return Ok(new { message = "Đánh giá đã được gửi và đang chờ duyệt." });
    }

    [HttpGet("reviews")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<object>> GetReviews(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] bool? approved = null)
    {
        var query = _db.Reviews
            .Include(r => r.User)
            .Include(r => r.Product)
            .Include(r => r.Images)
            .AsQueryable();

        if (approved.HasValue)
        {
            query = query.Where(r => r.IsApproved == approved.Value);
        }

        var total = await query.CountAsync();
        var items = await query
            .OrderByDescending(r => r.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(r => new AdminReviewDto(
                r.Id,
                r.ProductId,
                r.Product.Name,
                r.User != null ? r.User.FullName : "Khách hàng",
                r.User != null ? r.User.AvatarUrl : null,
                r.Rating,
                r.Comment,
                r.Images.Select(image => image.Url),
                r.IsApproved,
                r.AdminReply,
                r.CreatedAt))
            .ToListAsync();

        return Ok(new { total, page, pageSize, items });
    }

    [HttpPut("reviews/{id:int}/approve")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> Approve(int id)
    {
        var review = await _db.Reviews.FindAsync(id);
        if (review is null)
        {
            return NotFound();
        }

        review.IsApproved = true;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPut("reviews/{id:int}/hide")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> Hide(int id)
    {
        var review = await _db.Reviews.FindAsync(id);
        if (review is null)
        {
            return NotFound();
        }

        review.IsApproved = false;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPut("reviews/{id:int}/reply")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> Reply(int id, [FromBody] ReviewReplyRequest request)
    {
        var review = await _db.Reviews.FindAsync(id);
        if (review is null)
        {
            return NotFound();
        }

        review.AdminReply = request.Reply?.Trim();
        await _db.SaveChangesAsync();
        return NoContent();
    }
}

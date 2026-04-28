using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Web_NoiThat.Server.Data;
using Web_NoiThat.Server.DTOs;
using Web_NoiThat.Server.Models;

namespace Web_NoiThat.Server.Controllers;

[ApiController]
[Route("api/categories")]
[Authorize(Roles = "Admin")]
public class CategoriesAdminController : ControllerBase
{
    private readonly AppDbContext _db;

    public CategoriesAdminController(AppDbContext db) => _db = db;

    [HttpGet("admin")]
    public async Task<ActionResult<IEnumerable<AdminCategoryDto>>> GetAdminList()
    {
        var items = await _db.Categories
            .OrderBy(c => c.ParentCategoryId.HasValue)
            .ThenBy(c => c.SortOrder)
            .ThenBy(c => c.Name)
            .Select(c => new AdminCategoryDto(
                c.Id,
                c.Name,
                c.Slug,
                c.Description,
                c.ImageUrl,
                c.Icon,
                c.SortOrder,
                c.IsActive,
                c.ParentCategoryId,
                c.Products.Count(p => p.IsActive)))
            .ToListAsync();

        return Ok(items);
    }

    [HttpPost]
    public async Task<ActionResult<AdminCategoryDto>> Create([FromBody] CreateOrUpdateCategoryRequest request)
    {
        var validationError = await ValidateRequestAsync(request);
        if (validationError is not null)
        {
            return validationError;
        }

        var category = new Category
        {
            Name = request.Name.Trim(),
            Slug = request.Slug.Trim().ToLowerInvariant(),
            Description = request.Description?.Trim(),
            ImageUrl = request.ImageUrl?.Trim(),
            Icon = request.Icon?.Trim(),
            SortOrder = request.SortOrder,
            IsActive = request.IsActive,
            ParentCategoryId = request.ParentCategoryId,
            CreatedAt = DateTime.UtcNow
        };

        _db.Categories.Add(category);
        await _db.SaveChangesAsync();

        return Created($"/api/categories/{category.Slug}", ToAdminDto(category));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<AdminCategoryDto>> Update(int id, [FromBody] CreateOrUpdateCategoryRequest request)
    {
        var category = await _db.Categories.Include(c => c.Products).FirstOrDefaultAsync(c => c.Id == id);
        if (category is null)
        {
            return NotFound();
        }

        var validationError = await ValidateRequestAsync(request, id);
        if (validationError is not null)
        {
            return validationError;
        }

        category.Name = request.Name.Trim();
        category.Slug = request.Slug.Trim().ToLowerInvariant();
        category.Description = request.Description?.Trim();
        category.ImageUrl = request.ImageUrl?.Trim();
        category.Icon = request.Icon?.Trim();
        category.SortOrder = request.SortOrder;
        category.IsActive = request.IsActive;
        category.ParentCategoryId = request.ParentCategoryId;

        await _db.SaveChangesAsync();
        return Ok(ToAdminDto(category));
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> Delete(int id)
    {
        var category = await _db.Categories.FindAsync(id);
        if (category is null)
        {
            return NotFound();
        }

        category.IsActive = false;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private async Task<ActionResult?> ValidateRequestAsync(CreateOrUpdateCategoryRequest request, int? categoryId = null)
    {
        if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Slug))
        {
            return BadRequest(new { message = "Tên và slug danh mục là bắt buộc." });
        }

        var slug = request.Slug.Trim().ToLowerInvariant();
        var duplicatedSlug = await _db.Categories.AnyAsync(c => c.Slug == slug && c.Id != categoryId);
        if (duplicatedSlug)
        {
            return BadRequest(new { message = "Slug danh mục đã tồn tại." });
        }

        if (request.ParentCategoryId.HasValue)
        {
            if (request.ParentCategoryId == categoryId)
            {
                return BadRequest(new { message = "Danh mục không thể là danh mục cha của chính nó." });
            }

            var parentExists = await _db.Categories.AnyAsync(c => c.Id == request.ParentCategoryId.Value);
            if (!parentExists)
            {
                return BadRequest(new { message = "Danh mục cha không tồn tại." });
            }
        }

        return null;
    }

    private static AdminCategoryDto ToAdminDto(Category category) =>
        new(
            category.Id,
            category.Name,
            category.Slug,
            category.Description,
            category.ImageUrl,
            category.Icon,
            category.SortOrder,
            category.IsActive,
            category.ParentCategoryId,
            category.Products.Count(p => p.IsActive));
}

using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Web_NoiThat.Server.Data;
using Web_NoiThat.Server.DTOs;
using Web_NoiThat.Server.Models;

namespace Web_NoiThat.Server.Controllers;

[ApiController]
[Route("api/home-merchandising")]
public class HomeMerchandisingController : ControllerBase
{
    private readonly AppDbContext _db;
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    public HomeMerchandisingController(AppDbContext db) => _db = db;

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<HomeMerchandisingView>> GetPublic()
    {
        var config = await _db.HomeMerchandisingConfigs.FirstOrDefaultAsync(c => c.Id == 1);
        if (config is null)
        {
            return Ok(DefaultView());
        }

        var published = config.PublishedVersionId.HasValue
            ? await _db.HomeMerchandisingVersions.FirstOrDefaultAsync(v => v.Id == config.PublishedVersionId.Value)
            : null;

        var view = published is null
            ? await BuildViewAsync(
                config.HeroTitle,
                config.HeroDescription,
                config.QuickCollectionsJson,
                config.ServiceHighlightsJson,
                config.CurrentVersion,
                config.PublishedVersionId,
                config.UpdatedAt,
                config.PublishedAt)
            : await BuildViewAsync(
                published.HeroTitle,
                published.HeroDescription,
                published.QuickCollectionsJson,
                published.ServiceHighlightsJson,
                config.CurrentVersion,
                config.PublishedVersionId,
                config.UpdatedAt,
                config.PublishedAt);

        return Ok(view);
    }

    [HttpGet("admin")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<HomeMerchandisingAdminView>> GetAdmin()
    {
        var config = await EnsureConfigAsync();
        return Ok(await BuildAdminViewAsync(config));
    }

    [HttpPut("admin/draft")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<HomeMerchandisingAdminView>> SaveDraft([FromBody] HomeMerchandisingDraftRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.HeroTitle) || string.IsNullOrWhiteSpace(request.HeroDescription))
        {
            return BadRequest(new { message = "Hero title va description la bat buoc." });
        }

        var categoryIds = (request.QuickCategoryIds ?? [])
            .Where(id => id > 0)
            .Distinct()
            .Take(8)
            .ToList();

        var validCategoryIds = await _db.Categories
            .Where(c => c.IsActive && categoryIds.Contains(c.Id))
            .Select(c => c.Id)
            .ToListAsync();

        if (validCategoryIds.Count != categoryIds.Count)
        {
            return BadRequest(new { message = "Quick collections chua duoc gan dung category." });
        }

        var serviceCards = (request.ServiceCards ?? [])
            .Where(item => item.ProductId > 0)
            .GroupBy(item => item.ProductId)
            .Select(group => group.First())
            .Take(3)
            .ToList();

        var productIds = serviceCards.Select(item => item.ProductId).ToList();
        var validProductIds = await _db.Products
            .Where(p => p.IsActive && productIds.Contains(p.Id))
            .Select(p => p.Id)
            .ToListAsync();

        if (validProductIds.Count != productIds.Count)
        {
            return BadRequest(new { message = "Service cards chua duoc gan dung san pham." });
        }

        var quickCollectionsPayload = categoryIds
            .Select(id => new StoredQuickCollection(id))
            .ToList();

        var serviceCardsPayload = serviceCards
            .Select(item => new StoredServiceCard(
                item.ProductId,
                string.IsNullOrWhiteSpace(item.Description) ? string.Empty : item.Description.Trim(),
                string.IsNullOrWhiteSpace(item.Theme) ? "blue" : item.Theme.Trim().ToLowerInvariant()))
            .ToList();

        var config = await EnsureConfigAsync();
        config.CurrentVersion += 1;
        config.HeroTitle = request.HeroTitle.Trim();
        config.HeroDescription = request.HeroDescription.Trim();
        config.QuickCollectionsJson = JsonSerializer.Serialize(quickCollectionsPayload, JsonOptions);
        config.ServiceHighlightsJson = JsonSerializer.Serialize(serviceCardsPayload, JsonOptions);
        config.UpdatedAt = DateTime.UtcNow;

        _db.HomeMerchandisingVersions.Add(new HomeMerchandisingVersion
        {
            VersionNumber = config.CurrentVersion,
            HeroTitle = config.HeroTitle,
            HeroDescription = config.HeroDescription,
            QuickCollectionsJson = config.QuickCollectionsJson,
            ServiceHighlightsJson = config.ServiceHighlightsJson,
            IsPublished = false,
            CreatedAt = DateTime.UtcNow,
        });

        await _db.SaveChangesAsync();
        return Ok(await BuildAdminViewAsync(config));
    }

    [HttpPost("admin/publish")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<HomeMerchandisingAdminView>> Publish([FromBody] PublishMerchandisingRequest? request)
    {
        var config = await EnsureConfigAsync();

        HomeMerchandisingVersion? target;
        if (request?.VersionId is int versionId)
        {
            target = await _db.HomeMerchandisingVersions.FirstOrDefaultAsync(v => v.Id == versionId);
            if (target is null)
            {
                return NotFound(new { message = "Khong tim thay version can publish." });
            }
        }
        else
        {
            target = await _db.HomeMerchandisingVersions
                .OrderByDescending(v => v.VersionNumber)
                .FirstOrDefaultAsync();

            if (target is null)
            {
                config.CurrentVersion += 1;
                target = new HomeMerchandisingVersion
                {
                    VersionNumber = config.CurrentVersion,
                    HeroTitle = config.HeroTitle,
                    HeroDescription = config.HeroDescription,
                    QuickCollectionsJson = config.QuickCollectionsJson,
                    ServiceHighlightsJson = config.ServiceHighlightsJson,
                    IsPublished = false,
                    CreatedAt = DateTime.UtcNow,
                };
                _db.HomeMerchandisingVersions.Add(target);
                await _db.SaveChangesAsync();
            }
        }

        var allVersions = await _db.HomeMerchandisingVersions.ToListAsync();
        foreach (var version in allVersions)
        {
            version.IsPublished = version.Id == target.Id;
        }

        config.PublishedVersionId = target.Id;
        config.PublishedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(await BuildAdminViewAsync(config));
    }

    private async Task<HomeMerchandisingAdminView> BuildAdminViewAsync(HomeMerchandisingConfig config)
    {
        var current = await BuildViewAsync(
            config.HeroTitle,
            config.HeroDescription,
            config.QuickCollectionsJson,
            config.ServiceHighlightsJson,
            config.CurrentVersion,
            config.PublishedVersionId,
            config.UpdatedAt,
            config.PublishedAt);

        var versions = await _db.HomeMerchandisingVersions
            .OrderByDescending(v => v.VersionNumber)
            .Take(20)
            .Select(v => new HomeMerchandisingVersionView(v.Id, v.VersionNumber, v.IsPublished, v.CreatedAt))
            .ToListAsync();

        return new HomeMerchandisingAdminView(current, versions);
    }

    private async Task<HomeMerchandisingView> BuildViewAsync(
        string heroTitle,
        string heroDescription,
        string quickCollectionsJson,
        string serviceHighlightsJson,
        int currentVersion,
        int? publishedVersion,
        DateTime updatedAt,
        DateTime? publishedAt)
    {
        var quickCollectionItems = Deserialize<List<StoredQuickCollection>>(quickCollectionsJson) ?? [];
        var serviceCardItems = Deserialize<List<StoredServiceCard>>(serviceHighlightsJson) ?? [];

        var categoryIds = quickCollectionItems.Select(item => item.CategoryId).Distinct().ToList();
        var productIds = serviceCardItems.Select(item => item.ProductId).Distinct().ToList();

        var categories = await _db.Categories
            .Where(c => c.IsActive && categoryIds.Contains(c.Id))
            .Select(c => new { c.Id, c.Name, c.Slug })
            .ToListAsync();

        var products = await _db.Products
            .Where(p => p.IsActive && productIds.Contains(p.Id))
            .Select(p => new { p.Id, p.Name, p.Slug, p.MainImageUrl, p.Price, p.SalePrice })
            .ToListAsync();

        var categoryMap = categories.ToDictionary(item => item.Id);
        var productMap = products.ToDictionary(item => item.Id);

        var quickCollections = quickCollectionItems
            .Where(item => categoryMap.ContainsKey(item.CategoryId))
            .Select(item =>
            {
                var category = categoryMap[item.CategoryId];
                return new HomeQuickCollectionView(category.Id, category.Name, category.Slug);
            })
            .ToList();

        var serviceCards = serviceCardItems
            .Where(item => productMap.ContainsKey(item.ProductId))
            .Select(item =>
            {
                var product = productMap[item.ProductId];
                return new HomeServiceCardView(
                    product.Id,
                    product.Name,
                    product.Slug,
                    product.MainImageUrl,
                    product.SalePrice ?? product.Price,
                    item.Description,
                    item.Theme);
            })
            .ToList();

        return new HomeMerchandisingView(
            heroTitle,
            heroDescription,
            quickCollections,
            serviceCards,
            currentVersion,
            publishedVersion,
            updatedAt,
            publishedAt);
    }

    private async Task<HomeMerchandisingConfig> EnsureConfigAsync()
    {
        var config = await _db.HomeMerchandisingConfigs.FirstOrDefaultAsync(c => c.Id == 1);
        if (config is not null)
        {
            return config;
        }

        config = new HomeMerchandisingConfig
        {
            Id = 1,
            HeroTitle = "Nang cap trai nghiem cong nghe theo cach nhin chuyen nghiep hon.",
            HeroDescription = "Tu flagship moi, gaming phone, phu kien hot den cac deal co chon loc.",
            QuickCollectionsJson = "[]",
            ServiceHighlightsJson = "[]",
            CurrentVersion = 1,
            UpdatedAt = DateTime.UtcNow,
        };

        _db.HomeMerchandisingConfigs.Add(config);
        await _db.SaveChangesAsync();
        return config;
    }

    private static HomeMerchandisingView DefaultView() =>
        new(
            "Nang cap trai nghiem cong nghe theo cach nhin chuyen nghiep hon.",
            "Tu flagship moi, gaming phone, phu kien hot den cac deal co chon loc.",
            [],
            [],
            0,
            null,
            DateTime.UtcNow,
            null);

    private static T? Deserialize<T>(string? source)
    {
        if (string.IsNullOrWhiteSpace(source))
        {
            return default;
        }

        try
        {
            return JsonSerializer.Deserialize<T>(source, JsonOptions);
        }
        catch
        {
            return default;
        }
    }

    private record StoredQuickCollection(int CategoryId);
    private record StoredServiceCard(int ProductId, string Description, string Theme);
}

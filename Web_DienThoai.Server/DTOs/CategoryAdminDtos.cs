namespace Web_NoiThat.Server.DTOs;

public record CreateOrUpdateCategoryRequest(
    string Name,
    string Slug,
    string? Description,
    string? ImageUrl,
    string? Icon,
    int SortOrder,
    bool IsActive,
    int? ParentCategoryId
);

public record AdminCategoryDto(
    int Id,
    string Name,
    string Slug,
    string? Description,
    string? ImageUrl,
    string? Icon,
    int SortOrder,
    bool IsActive,
    int? ParentCategoryId,
    int ProductCount
);

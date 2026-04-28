namespace Web_NoiThat.Server.DTOs;

public record HomeServiceCardRequestItem(
    int ProductId,
    string? Description,
    string? Theme
);

public record HomeMerchandisingDraftRequest(
    string HeroTitle,
    string HeroDescription,
    IEnumerable<int> QuickCategoryIds,
    IEnumerable<HomeServiceCardRequestItem> ServiceCards
);

public record HomeQuickCollectionView(
    int CategoryId,
    string Name,
    string Slug
);

public record HomeServiceCardView(
    int ProductId,
    string Name,
    string Slug,
    string ImageUrl,
    decimal Price,
    string Description,
    string Theme
);

public record HomeMerchandisingView(
    string HeroTitle,
    string HeroDescription,
    IEnumerable<HomeQuickCollectionView> QuickCollections,
    IEnumerable<HomeServiceCardView> ServiceCards,
    int CurrentVersion,
    int? PublishedVersion,
    DateTime UpdatedAt,
    DateTime? PublishedAt
);

public record HomeMerchandisingVersionView(
    int Id,
    int VersionNumber,
    bool IsPublished,
    DateTime CreatedAt
);

public record HomeMerchandisingAdminView(
    HomeMerchandisingView Current,
    IEnumerable<HomeMerchandisingVersionView> Versions
);

public record PublishMerchandisingRequest(int? VersionId);

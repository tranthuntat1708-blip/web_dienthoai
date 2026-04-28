namespace Web_NoiThat.Server.Models;

public class HomeMerchandisingConfig
{
    public int Id { get; set; } = 1;
    public string HeroTitle { get; set; } = string.Empty;
    public string HeroDescription { get; set; } = string.Empty;
    public string QuickCollectionsJson { get; set; } = "[]";
    public string ServiceHighlightsJson { get; set; } = "[]";
    public int CurrentVersion { get; set; }
    public int? PublishedVersionId { get; set; }
    public DateTime? PublishedAt { get; set; }
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

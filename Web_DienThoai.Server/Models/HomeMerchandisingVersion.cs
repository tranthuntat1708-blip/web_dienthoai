namespace Web_NoiThat.Server.Models;

public class HomeMerchandisingVersion
{
    public int Id { get; set; }
    public int VersionNumber { get; set; }
    public string HeroTitle { get; set; } = string.Empty;
    public string HeroDescription { get; set; } = string.Empty;
    public string QuickCollectionsJson { get; set; } = "[]";
    public string ServiceHighlightsJson { get; set; } = "[]";
    public bool IsPublished { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

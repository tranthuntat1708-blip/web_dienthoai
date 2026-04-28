namespace Web_NoiThat.Server.Models;

public class BlogPost
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Excerpt { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;  // HTML / Markdown
    public string? CoverImageUrl { get; set; }
    public string? AuthorId { get; set; }
    public AppUser? Author { get; set; }
    public bool IsPublished { get; set; } = false;
    public string Type { get; set; } = "Blog";  // "Blog" | "Lookbook"
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

namespace Web_NoiThat.Server.Models;

public class Review
{
    public int Id { get; set; }
 public int ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public string? UserId { get; set; }
    public AppUser? User { get; set; }

    public int Rating { get; set; }         // 1 – 5 sao
    public string Comment { get; set; } = string.Empty;
    public ICollection<ReviewImage> Images { get; set; } = [];

    public bool IsApproved { get; set; } = false;  // Admin duyệt
    public string? AdminReply { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class ReviewImage
{
    public int Id { get; set; }
    public int ReviewId { get; set; }
    public Review Review { get; set; } = null!;
    public string Url { get; set; } = string.Empty;
}

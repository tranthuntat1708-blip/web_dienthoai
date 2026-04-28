namespace Web_NoiThat.Server.Models;

/// <summary>
/// Schema dữ liệu Sản phẩm nội thất - bao gồm kích thước, chất liệu, giá.
/// </summary>
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    // --- Giá ---
    public decimal Price { get; set; }
    public decimal? SalePrice { get; set; }       // Giá flash sale
    public bool IsOnSale { get; set; } = false;

    // --- Kích thước (cm) ---
    public double? LengthCm { get; set; }          // Dài
    public double? WidthCm { get; set; }   // Rộng
    public double? HeightCm { get; set; } // Cao
    public double? WeightKg { get; set; }          // Khối lượng (kg)

    // --- Phân loại ---
    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;
    public string Material { get; set; } = string.Empty;   // Gỗ, Da, Vải...
    public string Style { get; set; } = string.Empty;  // Minimalist, Indochine...
    public string Color { get; set; } = string.Empty;

    // --- Tồn kho ---
    public int Stock { get; set; } = 0;
    public bool IsActive { get; set; } = true;
    public int SoldCount { get; set; } = 0;

    // --- Ảnh ---
    public string MainImageUrl { get; set; } = string.Empty;
    public ICollection<ProductImage> SubImages { get; set; } = [];

 // --- Quan hệ ---
public ICollection<OrderItem> OrderItems { get; set; } = [];
    public ICollection<Review> Reviews { get; set; } = [];
    public ICollection<WishlistItem> WishlistItems { get; set; } = [];
    public ICollection<ProductBundle> Bundles { get; set; } = [];  // "Mua kèm"

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

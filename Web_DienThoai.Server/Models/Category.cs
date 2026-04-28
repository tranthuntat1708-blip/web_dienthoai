namespace Web_NoiThat.Server.Models;

/// <summary>
/// Danh mục sản phẩm nội thất thủ công / trang trí.
/// Hỗ trợ cấu trúc cây (parent → sub-categories).
/// </summary>
public class Category
{
    public int Id { get; set; }

    /// <summary>Tên hiển thị. VD: "Giỏ &amp; Khay Đựng Đồ"</summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>Slug URL-friendly. VD: "gio-khay-dung-do"</summary>
  public string Slug { get; set; } = string.Empty;

  /// <summary>Mô tả ngắn hiển thị trên trang danh mục</summary>
    public string? Description { get; set; }

    /// <summary>Ảnh banner / thumbnail của danh mục (WebP)</summary>
    public string? ImageUrl { get; set; }

    /// <summary>Icon class hoặc emoji đại diện. VD: "🧺" hoặc "icon-basket"</summary>
    public string? Icon { get; set; }

    /// <summary>Thứ tự hiển thị trên menu / trang chủ (tăng dần)</summary>
    public int SortOrder { get; set; } = 0;

    /// <summary>Ẩn/hiện danh mục trên frontend</summary>
    public bool IsActive { get; set; } = true;

    // ── Quan hệ cây ──────────────────────────────────────────
    /// <summary>Null = danh mục gốc (root). Có giá trị = danh mục con</summary>
 public int? ParentCategoryId { get; set; }
    public Category? ParentCategory { get; set; }
    public ICollection<Category> SubCategories { get; set; } = [];

    // ── Quan hệ 1-N với Product ───────────────────────────────
    public ICollection<Product> Products { get; set; } = [];

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

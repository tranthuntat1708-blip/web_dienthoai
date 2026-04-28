namespace Web_NoiThat.Server.Models;

/// <summary>
/// Ảnh phụ của sản phẩm (Sub-images / Gallery)
/// </summary>
public class ProductImage
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public string Url { get; set; } = string.Empty;
    public string? AltText { get; set; }
    public int SortOrder { get; set; } = 0;   // Drag & drop sort order
}

namespace Web_NoiThat.Server.Models;

/// <summary>
/// "Sản phẩm mua kèm" - gợi ý bundle
/// </summary>
public class ProductBundle
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public int BundledProductId { get; set; }
    public Product BundledProduct { get; set; } = null!;
}

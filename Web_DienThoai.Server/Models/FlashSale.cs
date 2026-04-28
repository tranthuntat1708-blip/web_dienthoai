namespace Web_NoiThat.Server.Models;

public class FlashSale
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime StartAt { get; set; }
    public DateTime EndAt { get; set; }
    public bool IsActive { get; set; } = true;
    public ICollection<FlashSaleItem> Items { get; set; } = [];
}

public class FlashSaleItem
{
    public int Id { get; set; }
    public int FlashSaleId { get; set; }
    public FlashSale FlashSale { get; set; } = null!;
    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;
    public decimal SalePrice { get; set; }
    public int? StockLimit { get; set; }    // Số lượng tối đa trong flash sale
    public int SoldQuantity { get; set; }   // Số lượng đã bán trong flash sale
}

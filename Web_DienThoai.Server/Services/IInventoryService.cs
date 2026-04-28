using Web_NoiThat.Server.Data;

namespace Web_NoiThat.Server.Services;

public interface IInventoryService
{
    /// <summary>
    /// Trừ kho atomic cho nhiều sản phẩm.
    /// Return: danh sách productId bị hết hàng (empty = thành công).
    /// </summary>
    Task<List<int>> DecrementStockAsync(IEnumerable<(int ProductId, int Quantity)> items);

    /// <summary>Hoàn trả stock khi đơn hàng thất bại/hủy</summary>
    Task RestoreStockAsync(IEnumerable<(int ProductId, int Quantity)> items);

    /// <summary>Đồng bộ stock từ SQL Server vào Redis</summary>
    Task SyncFromDatabaseAsync(AppDbContext db);
}

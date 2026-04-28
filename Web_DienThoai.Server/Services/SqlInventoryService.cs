using Microsoft.EntityFrameworkCore;
using Web_NoiThat.Server.Data;

namespace Web_NoiThat.Server.Services;

public class SqlInventoryService : IInventoryService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<SqlInventoryService> _logger;

    public SqlInventoryService(IServiceScopeFactory scopeFactory, ILogger<SqlInventoryService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    public async Task<List<int>> DecrementStockAsync(IEnumerable<(int ProductId, int Quantity)> items)
    {
        using var scope = _scopeFactory.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var productIds = items.Select(item => item.ProductId).Distinct().ToList();
        var stocks = await dbContext.Products
            .Where(p => productIds.Contains(p.Id))
            .ToDictionaryAsync(p => p.Id, p => p.Stock);

        var outOfStock = items
            .Where(item => !stocks.TryGetValue(item.ProductId, out var stock) || stock < item.Quantity)
            .Select(item => item.ProductId)
            .Distinct()
            .ToList();

        if (outOfStock.Any())
        {
            _logger.LogWarning("[SQL Inventory] Het hang ProductIds: {Ids}", string.Join(", ", outOfStock));
        }

        return outOfStock;
    }

    public Task RestoreStockAsync(IEnumerable<(int ProductId, int Quantity)> items)
    {
        _logger.LogInformation("[SQL Inventory] Khong can hoan tra Redis stock trong che do SQL-only.");
        return Task.CompletedTask;
    }

    public Task SyncFromDatabaseAsync(AppDbContext db)
    {
        _logger.LogInformation("[SQL Inventory] Bo qua dong bo stock sang Redis do UseRedisInventory=false.");
        return Task.CompletedTask;
    }
}

using StackExchange.Redis;
using Web_NoiThat.Server.Data;
using Microsoft.EntityFrameworkCore;

namespace Web_NoiThat.Server.Services;

public class RedisInventoryService : IInventoryService
{
    private readonly IConnectionMultiplexer _redis;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<RedisInventoryService> _logger;
    private const string KeyPrefix = "stock:product:";

    // Lua Script: Trừ kho atomic — kiểm tra trước khi trừ
    // Trả về stock còn lại nếu thành công, -1 nếu hết hàng, -2 nếu key không tồn tại
    private const string DecrLuaScript = @"
        local exists = redis.call('EXISTS', KEYS[1])
        if exists == 0 then
            return -2
        end
        local current = tonumber(redis.call('GET', KEYS[1]))
        local qty = tonumber(ARGV[1])
        if current >= qty then
            local remaining = redis.call('DECRBY', KEYS[1], qty)
            return remaining
        else
            return -1
        end
    ";

    public RedisInventoryService(
        IConnectionMultiplexer redis,
        IServiceScopeFactory scopeFactory,
        ILogger<RedisInventoryService> logger)
    {
        _redis = redis;
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    public async Task<List<int>> DecrementStockAsync(
        IEnumerable<(int ProductId, int Quantity)> items)
    {
        try
        {
            var db = _redis.GetDatabase();
            var outOfStock = new List<int>();
            var succeeded = new List<(int ProductId, int Quantity)>();

            foreach (var (productId, qty) in items)
            {
                var key = $"{KeyPrefix}{productId}";
                var result = (long)await db.ScriptEvaluateAsync(
                    DecrLuaScript,
                    new RedisKey[] { key },
                    new RedisValue[] { qty });

                if (result == -2)
                {
                    // Cache Miss: key không tồn tại trong Redis → query DB, set vào Redis, thử lại
                    _logger.LogWarning("[Redis] Cache miss cho Product {Id}, đang sync từ DB...", productId);
                    var stockFromDb = await LoadStockFromDbAsync(productId);

                    if (stockFromDb == null)
                    {
                        _logger.LogError("[Redis] Product {Id} không tồn tại trong DB!", productId);
                        outOfStock.Add(productId);
                        continue;
                    }

                    // Set stock vào Redis
                    await db.StringSetAsync(key, stockFromDb.Value);
                    _logger.LogInformation("[Redis] Đã sync Product {Id}: Stock = {Stock}", productId, stockFromDb.Value);

                    // Thử lại Lua script
                    result = (long)await db.ScriptEvaluateAsync(
                        DecrLuaScript,
                        new RedisKey[] { key },
                        new RedisValue[] { qty });
                }

                if (result >= 0)
                {
                    succeeded.Add((productId, qty));
                    _logger.LogInformation("[Redis] Product {Id}: trừ {Qty}, còn lại {Remaining}", productId, qty, result);
                }
                else
                {
                    outOfStock.Add(productId);
                    var currentStock = await db.StringGetAsync(key);
                    _logger.LogWarning("[Redis] Product {Id}: HẾT HÀNG (yêu cầu {Qty}, tồn kho {Stock})",
                        productId, qty, currentStock);
                }
            }

            // Nếu có sản phẩm hết hàng → rollback các sản phẩm đã trừ
            if (outOfStock.Any())
            {
                _logger.LogWarning("[Redis] Rollback {Count} sản phẩm đã trừ do có SP hết hàng", succeeded.Count);
                foreach (var (productId, qty) in succeeded)
                {
                    var key = $"{KeyPrefix}{productId}";
                    await db.StringIncrementAsync(key, qty);
                }
            }

            return outOfStock;
        }
        catch (RedisConnectionException ex)
        {
            _logger.LogWarning(ex, "[Redis] Không kết nối được Redis khi tạo đơn. Fallback sang kiểm tra tồn kho từ SQL.");
            return await ValidateStockFromDbAsync(items);
        }
        catch (RedisTimeoutException ex)
        {
            _logger.LogWarning(ex, "[Redis] Timeout khi trừ kho. Fallback sang kiểm tra tồn kho từ SQL.");
            return await ValidateStockFromDbAsync(items);
        }
    }

    public async Task RestoreStockAsync(
        IEnumerable<(int ProductId, int Quantity)> items)
    {
        var db = _redis.GetDatabase();
        foreach (var (productId, qty) in items)
        {
            var key = $"{KeyPrefix}{productId}";
            var newVal = await db.StringIncrementAsync(key, qty);
            _logger.LogInformation("[Redis] Hoàn trả Product {Id}: +{Qty}, tổng = {Total}", productId, qty, newVal);
        }
    }

    public async Task SyncFromDatabaseAsync(AppDbContext dbContext)
    {
        var db = _redis.GetDatabase();
        var products = await dbContext.Products
            .Select(p => new { p.Id, p.Stock })
            .ToListAsync();

        foreach (var p in products)
        {
            await db.StringSetAsync($"{KeyPrefix}{p.Id}", p.Stock);
        }

        _logger.LogInformation("[Redis] Đã sync stock cho {Count} sản phẩm từ DB", products.Count);
    }

    /// <summary>Query stock thực tế từ SQL Server (dùng khi cache miss)</summary>
    private async Task<int?> LoadStockFromDbAsync(int productId)
    {
        using var scope = _scopeFactory.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        return await dbContext.Products
            .Where(p => p.Id == productId)
            .Select(p => (int?)p.Stock)
            .FirstOrDefaultAsync();
    }

    private async Task<List<int>> ValidateStockFromDbAsync(IEnumerable<(int ProductId, int Quantity)> items)
    {
        using var scope = _scopeFactory.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var productIds = items.Select(item => item.ProductId).Distinct().ToList();
        var stocks = await dbContext.Products
            .Where(p => productIds.Contains(p.Id))
            .ToDictionaryAsync(p => p.Id, p => p.Stock);

        return items
            .Where(item => !stocks.TryGetValue(item.ProductId, out var stock) || stock < item.Quantity)
            .Select(item => item.ProductId)
            .Distinct()
            .ToList();
    }
}

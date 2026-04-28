using System.Text;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using StackExchange.Redis;
using Web_NoiThat.Server.Data;
using Web_NoiThat.Server.Models;
using Web_NoiThat.Server.Services;

var builder = WebApplication.CreateBuilder(args);

// ── Database ──────────────────────────────────────────────
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ── Redis ─────────────────────────────────────────────────
var redisConn = builder.Configuration.GetConnectionString("Redis") ?? "localhost:6379";
var useRedisInventory = builder.Configuration.GetValue("UseRedisInventory", true);
if (useRedisInventory)
{
    builder.Services.AddSingleton<IConnectionMultiplexer>(
        ConnectionMultiplexer.Connect(redisConn + ",abortConnect=false"));
    builder.Services.AddScoped<IInventoryService, RedisInventoryService>();
}
else
{
    builder.Services.AddScoped<IInventoryService, SqlInventoryService>();
}
builder.Services.AddScoped<IVnPayService, VnPayService>();

// ── Rate Limiting ─────────────────────────────────────────
builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("OrderLimit", opt =>
    {
        opt.PermitLimit = 5;
        opt.Window = TimeSpan.FromMinutes(1);
        opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        opt.QueueLimit = 0;
    });
    options.RejectionStatusCode = 429;
});

// ── Identity ──────────────────────────────────────────────
builder.Services.AddIdentity<AppUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.User.RequireUniqueEmail = true;
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();

// ── JWT Authentication ────────────────────────────────────
var jwtKey = builder.Configuration["Jwt:Key"]!;
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
  options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
    ValidateIssuer = true,
    ValidateAudience = true,
   ValidateLifetime = true,
     ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
   ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});

// ── CORS ──────────────────────────────────────────────────
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowViteClient", policy =>
    {
        if (builder.Environment.IsDevelopment())
        {
            policy
                .SetIsOriginAllowed(_ => true)
                .AllowAnyHeader()
                .AllowAnyMethod();
        }
        else
        {
            policy
                .WithOrigins(
                    "https://localhost:61348",
                    "http://localhost:61348",
                    "http://localhost:5173",
                    "https://localhost:5173",
                    "http://localhost:5174",
                    "https://localhost:5174")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        }
    });
});

// ── Controllers + Swagger ─────────────────────────────────
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // camelCase JSON để khớp với TypeScript interfaces
        options.JsonSerializerOptions.PropertyNamingPolicy =
    System.Text.Json.JsonNamingPolicy.CamelCase;
  // Serialize enum thành string thay vì int
        options.JsonSerializerOptions.Converters.Add(
            new System.Text.Json.Serialization.JsonStringEnumConverter());
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
 {
        Title = "Web Nội Thất API",
        Version = "v1",
        Description = "API cho nền tảng thương mại điện tử nội thất"
    });

    // Thêm nút Authorize trong Swagger UI
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization: nhập 'Bearer {token}'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
           Reference = new OpenApiReference
      {
   Type = ReferenceType.SecurityScheme,
      Id = "Bearer"
}
        },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
 c.SwaggerEndpoint("/swagger/v1/swagger.json", "Web Nội Thất API v1");
        c.RoutePrefix = "swagger";
    });
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
app.UseCors("AllowViteClient");
app.UseAuthentication();
app.UseAuthorization();
app.UseRateLimiter();

app.MapControllers();
app.MapFallbackToFile("/index.html");

// ── Auto migrate + Seed khi khởi động ─────────────────────
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var startupLogger = scope.ServiceProvider.GetRequiredService<ILoggerFactory>()
        .CreateLogger("Startup");

    db.Database.Migrate();
    await EnsureOrderPaymentMethodColumnAsync(db, startupLogger);
    await EnsureHomeMerchandisingTableAsync(db, startupLogger);
    await EnsureHomeMerchandisingVersioningAsync(db, startupLogger);
    await DbSeeder.SeedAsync(db, userManager, roleManager);

    // Đồng bộ stock SQL → Redis
    var inventory = scope.ServiceProvider.GetRequiredService<IInventoryService>();

    try
    {
        await inventory.SyncFromDatabaseAsync(db);
    }
    catch (Exception ex)
    {
        startupLogger.LogWarning(ex,
            "Khong the ket noi Redis khi khoi dong. Ung dung van tiep tuc chay, nhung cac tinh nang ton kho realtime co the khong hoat dong.");
    }
}

app.Run();

static async Task EnsureOrderPaymentMethodColumnAsync(AppDbContext db, ILogger logger)
{
    const string sql = """
        IF COL_LENGTH('Orders', 'PaymentMethod') IS NULL
        BEGIN
            ALTER TABLE Orders
            ADD PaymentMethod nvarchar(max) NOT NULL CONSTRAINT DF_Orders_PaymentMethod DEFAULT 'VNPay';
        END
        """;

    try
    {
        await db.Database.ExecuteSqlRawAsync(sql);
    }
    catch (Exception ex)
    {
        logger.LogWarning(ex, "Khong the tu dong bo sung cot PaymentMethod cho bang Orders.");
    }
}

static async Task EnsureHomeMerchandisingTableAsync(AppDbContext db, ILogger logger)
{
    const string sql = """
        IF OBJECT_ID('HomeMerchandisingConfigs', 'U') IS NULL
        BEGIN
            CREATE TABLE HomeMerchandisingConfigs
            (
                Id INT NOT NULL CONSTRAINT PK_HomeMerchandisingConfigs PRIMARY KEY,
                HeroTitle NVARCHAR(MAX) NOT NULL,
                HeroDescription NVARCHAR(MAX) NOT NULL,
                QuickCollectionsJson NVARCHAR(MAX) NOT NULL,
                ServiceHighlightsJson NVARCHAR(MAX) NOT NULL,
                UpdatedAt DATETIME2 NOT NULL
            );

            INSERT INTO HomeMerchandisingConfigs
            (
                Id,
                HeroTitle,
                HeroDescription,
                QuickCollectionsJson,
                ServiceHighlightsJson,
                UpdatedAt
            )
            VALUES
            (
                1,
                N'Nâng cấp trải nghiệm công nghệ theo cách nhìn chuyên nghiệp hơn.',
                N'Từ flagship mới, gaming phone, phụ kiện hot đến các deal có chọn lọc. Trang chủ được tinh chỉnh để bạn thấy ngay sản phẩm đáng mua, deal đáng săn và bài viết đáng đọc.',
                N'[""iPhone"",""Samsung Galaxy"",""Xiaomi"",""Gaming Phone"",""Camera flagship"",""Pin trâu lâu""]',
                N'[{"title"":""Ưu đãi mỗi ngày"",""description"":""Đẩy khu vực mini-banner thành thông điệp có trọng tâm, không chỉ là một dòng text đặt tạm."",""theme"":""yellow""},{"title"":""Freeship và giao nhanh"",""description"":""Thể hiện lợi ích vận hành để người mua có thêm lý do ở lại và đặt đơn ngay tại trang chủ."",""theme"":""emerald""},{"title"":""Trả góp và dịch vụ hậu mãi"",""description"":""Gợi ý để sau này gắn với đối tác ngân hàng, bảo hành, đổi mới hoặc thu cũ đổi mới."",""theme"":""blue""}]',
                SYSUTCDATETIME()
            );
        END
        """;

    try
    {
        await db.Database.ExecuteSqlRawAsync(sql);
    }
    catch (Exception ex)
    {
        logger.LogWarning(ex, "Khong the tu dong tao bang HomeMerchandisingConfigs.");
    }
}

static async Task EnsureHomeMerchandisingVersioningAsync(AppDbContext db, ILogger logger)
{
    const string sql = """
        IF COL_LENGTH('HomeMerchandisingConfigs', 'CurrentVersion') IS NULL
        BEGIN
            ALTER TABLE HomeMerchandisingConfigs
            ADD CurrentVersion INT NOT NULL CONSTRAINT DF_HomeMerchandisingConfigs_CurrentVersion DEFAULT 1;
        END;

        IF COL_LENGTH('HomeMerchandisingConfigs', 'PublishedVersionId') IS NULL
        BEGIN
            ALTER TABLE HomeMerchandisingConfigs
            ADD PublishedVersionId INT NULL;
        END;

        IF COL_LENGTH('HomeMerchandisingConfigs', 'PublishedAt') IS NULL
        BEGIN
            ALTER TABLE HomeMerchandisingConfigs
            ADD PublishedAt DATETIME2 NULL;
        END;

        IF OBJECT_ID('HomeMerchandisingVersions', 'U') IS NULL
        BEGIN
            CREATE TABLE HomeMerchandisingVersions
            (
                Id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_HomeMerchandisingVersions PRIMARY KEY,
                VersionNumber INT NOT NULL,
                HeroTitle NVARCHAR(MAX) NOT NULL,
                HeroDescription NVARCHAR(MAX) NOT NULL,
                QuickCollectionsJson NVARCHAR(MAX) NOT NULL,
                ServiceHighlightsJson NVARCHAR(MAX) NOT NULL,
                IsPublished BIT NOT NULL CONSTRAINT DF_HomeMerchandisingVersions_IsPublished DEFAULT 0,
                CreatedAt DATETIME2 NOT NULL
            );
        END;
        """;

    try
    {
        await db.Database.ExecuteSqlRawAsync(sql);
    }
    catch (Exception ex)
    {
        logger.LogWarning(ex, "Khong the bo sung versioning cho merchandising.");
    }
}


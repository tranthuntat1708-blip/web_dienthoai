using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Web_NoiThat.Server.Models;

namespace Web_NoiThat.Server.Data;

/// <summary>
/// Seed dữ liệu mẫu cho hệ thống bán lẻ điện thoại Phong Điền Mobile.
/// </summary>
public static class DbSeeder
{
    public static async Task SeedAsync(
        AppDbContext db,
        UserManager<AppUser> userManager,
        RoleManager<IdentityRole> roleManager)
    {
        // ── 1. Roles ──────────────────────────────────────────
        foreach (var role in new[] { "Admin", "User" })
        {
            if (!await roleManager.RoleExistsAsync(role))
                await roleManager.CreateAsync(new IdentityRole(role));
        }

        if (await roleManager.RoleExistsAsync("Customer"))
        {
            var customerUsers = await userManager.GetUsersInRoleAsync("Customer");
            foreach (var customerUser in customerUsers)
            {
                if (!await userManager.IsInRoleAsync(customerUser, "User"))
                    await userManager.AddToRoleAsync(customerUser, "User");

                await userManager.RemoveFromRoleAsync(customerUser, "Customer");
            }

            var customerRole = await roleManager.FindByNameAsync("Customer");
            if (customerRole is not null)
                await roleManager.DeleteAsync(customerRole);
        }

        // ── 2. Admin user ─────────────────────────────────────
        const string adminEmail = "admin@phongdienmobile.vn";
        if (await userManager.FindByEmailAsync(adminEmail) is null)
        {
            var admin = new AppUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                FullName = "Phong Điền Mobile Admin",
                EmailConfirmed = true
            };
            await userManager.CreateAsync(admin, "Admin@123456");
            await userManager.AddToRoleAsync(admin, "Admin");
        }

        // ── 3. Categories ─────────────────────────────────────
        if (await db.Categories.AnyAsync()) 
        {
            // Xóa sạch để pivot hoàn toàn
            db.Categories.RemoveRange(db.Categories);
            db.Products.RemoveRange(db.Products);
            db.BlogPosts.RemoveRange(db.BlogPosts);
            db.FlashSales.RemoveRange(db.FlashSales);
            db.Vouchers.RemoveRange(db.Vouchers);
            await db.SaveChangesAsync();
        }

        var catIphone = new Category { Name = "iPhone", Slug = "iphone", Icon = "📱", SortOrder = 1, IsActive = true, Description = "Các dòng iPhone mới nhất từ Apple." };
        var catSamsung = new Category { Name = "Samsung", Slug = "samsung", Icon = "🪐", SortOrder = 2, IsActive = true, Description = "Điện thoại Samsung Galaxy S, Z, A series." };
        var catXiaomi = new Category { Name = "Xiaomi", Slug = "xiaomi", Icon = "🟠", SortOrder = 3, IsActive = true, Description = "Smartphone Xiaomi hiệu năng cao, giá tốt." };
        var catOppo = new Category { Name = "OPPO", Slug = "oppo", Icon = "🟢", SortOrder = 4, IsActive = true, Description = "Chuyên gia selfie và thiết kế thời thượng." };
        var catTablet = new Category { Name = "iPad & Máy tính bảng", Slug = "ipad-tablet", Icon = "📟", SortOrder = 5, IsActive = true, Description = "Máy tính bảng phục vụ làm việc và giải trí." };
        var catPhuKien = new Category { Name = "Phụ kiện Sạc, Cáp", Slug = "phu-kien-sac-cap", Icon = "🔌", SortOrder = 6, IsActive = true, Description = "Sạc nhanh, cáp bền, bảo hành chính hãng." };
        var catAudio = new Category { Name = "Tai nghe (Audio)", Slug = "tai-nghe-audio", Icon = "🎧", SortOrder = 7, IsActive = true, Description = "Tai nghe Bluetooth, True Wireless, Headphone." };
        var catWatch = new Category { Name = "Đồng hồ thông minh", Slug = "dong-ho-thong-minh", Icon = "⌚", SortOrder = 8, IsActive = true, Description = "Apple Watch, Galaxy Watch, Garmin." };
        var catOld = new Category { Name = "Máy cũ giá rẻ", Slug = "may-cu-gia-re", Icon = "♻️", SortOrder = 9, IsActive = true, Description = "Hàng 99%, nguyên zin, bảo hành uy tín." };
        var catLimited = new Category { Name = "Bộ sưu tập Limited", Slug = "bo-suu-tap-limited", Icon = "✨", SortOrder = 10, IsActive = true, Description = "Phiên bản đặc biệt, giới hạn số lượng." };

        db.Categories.AddRange(catIphone, catSamsung, catXiaomi, catOppo, catTablet, catPhuKien, catAudio, catWatch, catOld, catLimited);
        await db.SaveChangesAsync();

        // ── 4. Products ───────────────────────────────────────
        var products = new List<Product>
        {
            new() {
                Name = "iPhone 16 Pro Max 256GB", Slug = "iphone-16-pro-max-256gb",
                Description = "Siêu phẩm 2024 với chip A18 Pro mạnh mẽ, RAM 8GB, bộ nhớ 256GB, màn hình 6.9 inch ProMotion, camera 48MP zoom 5x, pin 4685mAh và sạc nhanh 35W. Thiết kế Titan sang trọng, hỗ trợ 5G và MagSafe.",
                Price = 34_990_000, CategoryId = catIphone.Id,
                Material = "Titanium", Style = "Flagship", Color = "Desert Titanium",
                WeightKg = 0.227, Stock = 50, SoldCount = 120,
                MainImageUrl = "https://www.apple.com/newsroom/images/2024/09/apple-debuts-iphone-16-pro-and-iphone-16-pro-max/article/Apple-iPhone-16-Pro-hero-geo-240909_inline.jpg.large.jpg"
            },
            new() {
                Name = "Samsung Galaxy S24 Ultra 512GB", Slug = "samsung-galaxy-s24-ultra-512gb",
                Description = "AI Phone đỉnh cao với RAM 12GB, bộ nhớ 512GB, màn hình 6.8 inch Dynamic AMOLED, camera 200MP, pin 5000mAh, sạc nhanh 45W và kết nối 5G. Bút S-Pen quyền lực, thiết kế Titanium cao cấp.",
                Price = 31_490_000, SalePrice = 28_990_000, IsOnSale = true,
                CategoryId = catSamsung.Id, Material = "Titanium/Kính", Style = "Flagship", Color = "Titanium Gray",
                WeightKg = 0.233, Stock = 30, SoldCount = 85,
                MainImageUrl = "https://d2g44tvvp35wo2.cloudfront.net/photo/global/2024/01/17/Galaxy-S24-Series_dl4.jpg"
            },
            new() {
                Name = "Xiaomi 14 Ultra 12GB/256GB", Slug = "xiaomi-14-ultra-256gb",
                Description = "Ống kính Leica Summilux huyền thoại, RAM 12GB, bộ nhớ 256GB, màn hình 6.73 inch AMOLED, camera 50MP, pin 5000mAh, sạc siêu nhanh 90W và kết nối 5G. Cảm biến 1 inch cho trải nghiệm chụp ảnh flagship.",
                Price = 29_990_000, CategoryId = catXiaomi.Id,
                Material = "Kính/Kim loại", Style = "Premium", Color = "Trắng",
                WeightKg = 0.22, Stock = 15, SoldCount = 40,
                MainImageUrl = "https://i02.appmifile.com/mi-com-product/fly-birds/new-xiaomi-14-ultra/PC/59154892f0b5b2e4ddb970d1ccbfa44e.png"
            },
            new() {
                Name = "iPad Pro M4 11 inch (2024) Wi-Fi 256GB", Slug = "ipad-pro-m4-11-v2024",
                Description = "Máy tính bảng cao cấp với chip M4, bộ nhớ 256GB, màn hình 11 inch Ultra Retina XDR, kết nối Wi‑Fi và thiết kế mỏng nhẹ tối ưu cho học tập, sáng tạo nội dung và giải trí.",
                Price = 28_990_000, CategoryId = catTablet.Id,
                Material = "Nhôm", Style = "Pro", Color = "Space Black",
                WeightKg = 0.444, Stock = 20, SoldCount = 55,
                MainImageUrl = "https://www.apple.com/newsroom/images/2024/05/apple-unveils-stunning-new-ipad-pro-with-m4-chip-and-apple-pencil-pro/article/Apple-iPad-Pro-space-black-2-up-240507_big.jpg.large.jpg"
            },
            new() {
                Name = "Tai nghe AirPods Pro Gen 2 USB-C", Slug = "airpods-pro-gen-2-usb-c",
                Description = "Tai nghe không dây cao cấp với chống ồn chủ động 2x, âm thanh thích ứng, xuyên âm thông minh, kết nối Bluetooth, cổng USB-C và hộp sạc MagSafe tiện lợi. Thiết kế nhỏ gọn cho nhu cầu nghe nhạc và gọi thoại hằng ngày.",
                Price = 6_190_000, SalePrice = 5_290_000, IsOnSale = true,
                CategoryId = catAudio.Id, Material = "Nhựa bóng", Style = "Modern", Color = "Trắng",
                WeightKg = 0.05, Stock = 100, SoldCount = 450,
                MainImageUrl = "https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/airpods-pro-2.png"
            },
            new() {
                Name = "iPhone 16 Pro 128GB", Slug = "iphone-16-pro-128gb",
                Description = "Chip A18 Pro, RAM 8GB, bộ nhớ 128GB, màn hình 6.3 inch ProMotion, camera 48MP, pin 3582mAh và sạc nhanh 30W. Hỗ trợ 5G, MagSafe và hoàn thiện Titanium.",
                Price = 29_990_000, CategoryId = catIphone.Id, Material = "Titanium", Style = "Flagship", Color = "Titanium Black", WeightKg = 0.199, Stock = 45, SoldCount = 80,
                MainImageUrl = "https://placehold.co/600x600?text=iPhone+16+Pro"
            },
            new() {
                Name = "iPhone 16 Pro 512GB", Slug = "iphone-16-pro-512gb",
                Description = "Chip A18 Pro, RAM 8GB, bộ nhớ 512GB, màn hình 6.3 inch ProMotion, camera 48MP và pin 3582mAh. Phiên bản cấu hình cao cho nhu cầu quay chụp và lưu trữ nhiều.",
                Price = 35_490_000, CategoryId = catIphone.Id, Material = "Titanium", Style = "Flagship", Color = "Natural Titanium", WeightKg = 0.199, Stock = 25, SoldCount = 34,
                MainImageUrl = "https://placehold.co/600x600?text=iPhone+16+Pro+512"
            },
            new() {
                Name = "iPhone 16 128GB", Slug = "iphone-16-128gb",
                Description = "Chip A18, RAM 8GB, bộ nhớ 128GB, màn hình 6.1 inch Super Retina XDR, camera 48MP, pin 3561mAh và sạc nhanh 27W. Thiết kế mỏng nhẹ, hỗ trợ 5G.",
                Price = 22_990_000, CategoryId = catIphone.Id, Material = "Nhôm/Kính", Style = "Mainstream", Color = "Ultramarine", WeightKg = 0.173, Stock = 70, SoldCount = 140,
                MainImageUrl = "https://placehold.co/600x600?text=iPhone+16"
            },
            new() {
                Name = "iPhone 16 Plus 256GB", Slug = "iphone-16-plus-256gb",
                Description = "Chip A18, RAM 8GB, bộ nhớ 256GB, màn hình 6.7 inch Super Retina XDR, camera 48MP, pin 4383mAh và sạc nhanh 27W. Phù hợp người thích màn hình lớn và pin tốt.",
                Price = 26_490_000, CategoryId = catIphone.Id, Material = "Nhôm/Kính", Style = "Mainstream", Color = "Pink", WeightKg = 0.199, Stock = 50, SoldCount = 77,
                MainImageUrl = "https://placehold.co/600x600?text=iPhone+16+Plus"
            },
            new() {
                Name = "iPhone 15 Pro Max 256GB", Slug = "iphone-15-pro-max-256gb",
                Description = "Chip A17 Pro, RAM 8GB, bộ nhớ 256GB, màn hình 6.7 inch ProMotion, camera 48MP, pin 4422mAh và cổng USB-C. Hiệu năng mạnh, quay video tốt và thiết kế Titanium.",
                Price = 28_490_000, SalePrice = 26_990_000, IsOnSale = true, CategoryId = catIphone.Id, Material = "Titanium", Style = "Flagship", Color = "Blue Titanium", WeightKg = 0.221, Stock = 38, SoldCount = 160,
                MainImageUrl = "https://placehold.co/600x600?text=iPhone+15+Pro+Max"
            },
            new() {
                Name = "iPhone 15 128GB", Slug = "iphone-15-128gb",
                Description = "Chip A16 Bionic, RAM 6GB, bộ nhớ 128GB, màn hình 6.1 inch Super Retina XDR, camera 48MP và pin 3349mAh. Máy nhỏ gọn, màu sắc trẻ trung và sạc USB-C.",
                Price = 18_990_000, CategoryId = catIphone.Id, Material = "Nhôm/Kính", Style = "Mainstream", Color = "Black", WeightKg = 0.171, Stock = 80, SoldCount = 210,
                MainImageUrl = "https://placehold.co/600x600?text=iPhone+15"
            },
            new() {
                Name = "iPhone 14 128GB", Slug = "iphone-14-128gb",
                Description = "Chip A15 Bionic, RAM 6GB, bộ nhớ 128GB, màn hình 6.1 inch Super Retina XDR, camera kép 12MP và pin 3279mAh. Lựa chọn cân bằng giữa giá và trải nghiệm.",
                Price = 15_490_000, CategoryId = catIphone.Id, Material = "Nhôm/Kính", Style = "Classic", Color = "Blue", WeightKg = 0.172, Stock = 65, SoldCount = 245,
                MainImageUrl = "https://placehold.co/600x600?text=iPhone+14"
            },
            new() {
                Name = "Samsung Galaxy S24 256GB", Slug = "samsung-galaxy-s24-256gb",
                Description = "RAM 8GB, bộ nhớ 256GB, màn hình 6.2 inch Dynamic AMOLED 2X, camera 50MP, pin 4000mAh, sạc nhanh 25W và kết nối 5G. Thiết kế gọn gàng cho trải nghiệm flagship nhỏ.",
                Price = 20_990_000, CategoryId = catSamsung.Id, Material = "Armor Aluminum/Kính", Style = "Flagship", Color = "Onyx Black", WeightKg = 0.167, Stock = 42, SoldCount = 91,
                MainImageUrl = "https://placehold.co/600x600?text=Galaxy+S24"
            },
            new() {
                Name = "Samsung Galaxy S24+ 256GB", Slug = "samsung-galaxy-s24-plus-256gb",
                Description = "RAM 12GB, bộ nhớ 256GB, màn hình 6.7 inch Dynamic AMOLED 2X, camera 50MP, pin 4900mAh và sạc nhanh 45W. Cấu hình mạnh, pin tốt và thiết kế cao cấp.",
                Price = 24_990_000, CategoryId = catSamsung.Id, Material = "Armor Aluminum/Kính", Style = "Flagship", Color = "Cobalt Violet", WeightKg = 0.196, Stock = 36, SoldCount = 63,
                MainImageUrl = "https://placehold.co/600x600?text=Galaxy+S24+"
            },
            new() {
                Name = "Samsung Galaxy Z Fold6 256GB", Slug = "samsung-galaxy-z-fold6-256gb",
                Description = "RAM 12GB, bộ nhớ 256GB, màn hình chính 7.6 inch AMOLED, camera 50MP, pin 4400mAh và kết nối 5G. Thiết kế gập mở cho đa nhiệm và làm việc di động.",
                Price = 41_990_000, CategoryId = catSamsung.Id, Material = "Armor Aluminum", Style = "Foldable", Color = "Silver Shadow", WeightKg = 0.239, Stock = 18, SoldCount = 22,
                MainImageUrl = "https://placehold.co/600x600?text=Galaxy+Z+Fold6"
            },
            new() {
                Name = "Samsung Galaxy Z Flip6 256GB", Slug = "samsung-galaxy-z-flip6-256gb",
                Description = "RAM 12GB, bộ nhớ 256GB, màn hình 6.7 inch AMOLED, camera 50MP, pin 4000mAh và kết nối 5G. Thiết kế thời trang, nhỏ gọn và chụp ảnh linh hoạt.",
                Price = 26_990_000, CategoryId = catSamsung.Id, Material = "Armor Aluminum/Kính", Style = "Foldable", Color = "Mint", WeightKg = 0.187, Stock = 22, SoldCount = 38,
                MainImageUrl = "https://placehold.co/600x600?text=Galaxy+Z+Flip6"
            },
            new() {
                Name = "Samsung Galaxy A55 5G 256GB", Slug = "samsung-galaxy-a55-256gb",
                Description = "RAM 8GB, bộ nhớ 256GB, màn hình 6.6 inch Super AMOLED, camera 50MP, pin 5000mAh và sạc nhanh 25W. Máy tầm trung mạnh cho học tập và giải trí.",
                Price = 10_490_000, CategoryId = catSamsung.Id, Material = "Nhôm/Kính", Style = "Mid-range", Color = "Awesome Iceblue", WeightKg = 0.213, Stock = 95, SoldCount = 170,
                MainImageUrl = "https://placehold.co/600x600?text=Galaxy+A55"
            },
            new() {
                Name = "Samsung Galaxy A35 5G 128GB", Slug = "samsung-galaxy-a35-128gb",
                Description = "RAM 8GB, bộ nhớ 128GB, màn hình 6.6 inch Super AMOLED, camera 50MP, pin 5000mAh và sạc nhanh 25W. Phù hợp người cần máy bền, màn đẹp, pin lâu.",
                Price = 8_290_000, CategoryId = catSamsung.Id, Material = "Nhựa/Kính", Style = "Mid-range", Color = "Awesome Navy", WeightKg = 0.209, Stock = 110, SoldCount = 198,
                MainImageUrl = "https://placehold.co/600x600?text=Galaxy+A35"
            },
            new() {
                Name = "Xiaomi 14 12GB/512GB", Slug = "xiaomi-14-12gb-512gb",
                Description = "RAM 12GB, bộ nhớ 512GB, màn hình 6.36 inch AMOLED, camera 50MP Leica, pin 4610mAh và sạc nhanh 90W. Thiết kế gọn, hiệu năng cao và chụp ảnh đẹp.",
                Price = 22_990_000, CategoryId = catXiaomi.Id, Material = "Kính/Kim loại", Style = "Premium", Color = "Đen", WeightKg = 0.193, Stock = 32, SoldCount = 58,
                MainImageUrl = "https://placehold.co/600x600?text=Xiaomi+14"
            },
            new() {
                Name = "Redmi Note 13 Pro+ 5G 12GB/256GB", Slug = "redmi-note-13-pro-plus-256gb",
                Description = "RAM 12GB, bộ nhớ 256GB, màn hình 6.67 inch AMOLED, camera 200MP, pin 5000mAh và sạc nhanh 120W. Máy nổi bật ở camera và tốc độ sạc.",
                Price = 10_990_000, CategoryId = catXiaomi.Id, Material = "Kính/Khung nhôm", Style = "Mid-range", Color = "Aurora Purple", WeightKg = 0.199, Stock = 86, SoldCount = 133,
                MainImageUrl = "https://placehold.co/600x600?text=Redmi+Note+13+Pro%2B"
            },
            new() {
                Name = "Xiaomi 13T Pro 12GB/512GB", Slug = "xiaomi-13t-pro-512gb",
                Description = "RAM 12GB, bộ nhớ 512GB, màn hình 6.67 inch AMOLED, camera 50MP Leica, pin 5000mAh và sạc nhanh 120W. Hiệu năng mạnh, giá dễ tiếp cận.",
                Price = 15_990_000, CategoryId = catXiaomi.Id, Material = "Kính", Style = "Performance", Color = "Alpine Blue", WeightKg = 0.206, Stock = 48, SoldCount = 102,
                MainImageUrl = "https://placehold.co/600x600?text=Xiaomi+13T+Pro"
            },
            new() {
                Name = "POCO X6 Pro 12GB/512GB", Slug = "poco-x6-pro-512gb",
                Description = "RAM 12GB, bộ nhớ 512GB, màn hình 6.67 inch AMOLED, camera 64MP, pin 5000mAh và sạc nhanh 67W. Tập trung hiệu năng gaming và màn hình mượt.",
                Price = 9_790_000, CategoryId = catXiaomi.Id, Material = "Nhựa cao cấp", Style = "Gaming", Color = "Yellow", WeightKg = 0.19, Stock = 74, SoldCount = 121,
                MainImageUrl = "https://placehold.co/600x600?text=POCO+X6+Pro"
            },
            new() {
                Name = "Redmi 13 8GB/256GB", Slug = "redmi-13-256gb",
                Description = "RAM 8GB, bộ nhớ 256GB, màn hình 6.79 inch, camera 108MP, pin 5030mAh và sạc nhanh 33W. Mức giá dễ mua cho nhu cầu cơ bản hằng ngày.",
                Price = 4_990_000, CategoryId = catXiaomi.Id, Material = "Nhựa", Style = "Budget", Color = "Midnight Black", WeightKg = 0.205, Stock = 140, SoldCount = 215,
                MainImageUrl = "https://placehold.co/600x600?text=Redmi+13"
            },
            new() {
                Name = "OPPO Find X8 16GB/512GB", Slug = "oppo-find-x8-512gb",
                Description = "RAM 16GB, bộ nhớ 512GB, màn hình 6.78 inch AMOLED, camera 50MP Hasselblad, pin 5400mAh và sạc nhanh 100W. Thiết kế mỏng sang và chụp ảnh tốt.",
                Price = 24_990_000, CategoryId = catOppo.Id, Material = "Kính/Kim loại", Style = "Flagship", Color = "Space Black", WeightKg = 0.198, Stock = 20, SoldCount = 27,
                MainImageUrl = "https://placehold.co/600x600?text=OPPO+Find+X8"
            },
            new() {
                Name = "OPPO Reno12 Pro 12GB/256GB", Slug = "oppo-reno12-pro-256gb",
                Description = "RAM 12GB, bộ nhớ 256GB, màn hình 6.7 inch AMOLED, camera 50MP, pin 5000mAh và sạc nhanh 80W. Thiết kế thời trang, tối ưu selfie và chân dung AI.",
                Price = 13_490_000, CategoryId = catOppo.Id, Material = "Kính", Style = "Lifestyle", Color = "Sunset Gold", WeightKg = 0.18, Stock = 52, SoldCount = 68,
                MainImageUrl = "https://placehold.co/600x600?text=OPPO+Reno12+Pro"
            },
            new() {
                Name = "OPPO Reno11 F 5G 256GB", Slug = "oppo-reno11-f-256gb",
                Description = "RAM 8GB, bộ nhớ 256GB, màn hình 6.7 inch AMOLED, camera 64MP, pin 5000mAh và sạc nhanh 67W. Phù hợp người thích máy đẹp, mỏng và chụp ảnh ổn.",
                Price = 8_990_000, CategoryId = catOppo.Id, Material = "Nhựa/Kính", Style = "Lifestyle", Color = "Palm Green", WeightKg = 0.177, Stock = 76, SoldCount = 118,
                MainImageUrl = "https://placehold.co/600x600?text=OPPO+Reno11+F"
            },
            new() {
                Name = "OPPO A79 5G 256GB", Slug = "oppo-a79-256gb",
                Description = "RAM 8GB, bộ nhớ 256GB, màn hình 6.72 inch, camera 50MP, pin 5000mAh và sạc nhanh 33W. Dễ dùng, pin lâu và loa kép ngoài trời tốt.",
                Price = 6_490_000, CategoryId = catOppo.Id, Material = "Nhựa", Style = "Budget", Color = "Glowing Green", WeightKg = 0.193, Stock = 98, SoldCount = 134,
                MainImageUrl = "https://placehold.co/600x600?text=OPPO+A79"
            },
            new() {
                Name = "iPad Air M2 11 inch Wi-Fi 128GB", Slug = "ipad-air-m2-11-128gb",
                Description = "Chip M2, bộ nhớ 128GB, màn hình 11 inch Liquid Retina, kết nối Wi‑Fi và thiết kế nhẹ cho học tập, ghi chú và sáng tạo nội dung.",
                Price = 16_990_000, CategoryId = catTablet.Id, Material = "Nhôm", Style = "Air", Color = "Blue", WeightKg = 0.462, Stock = 40, SoldCount = 59,
                MainImageUrl = "https://placehold.co/600x600?text=iPad+Air+M2"
            },
            new() {
                Name = "Samsung Galaxy Tab S9 256GB", Slug = "galaxy-tab-s9-256gb",
                Description = "RAM 12GB, bộ nhớ 256GB, màn hình 11 inch AMOLED, pin 8400mAh và sạc nhanh 45W. Phù hợp giải trí, học tập và vẽ ghi chú.",
                Price = 18_490_000, CategoryId = catTablet.Id, Material = "Nhôm", Style = "Premium Tablet", Color = "Graphite", WeightKg = 0.498, Stock = 24, SoldCount = 31,
                MainImageUrl = "https://placehold.co/600x600?text=Galaxy+Tab+S9"
            },
            new() {
                Name = "Xiaomi Pad 6 8GB/128GB", Slug = "xiaomi-pad-6-128gb",
                Description = "RAM 8GB, bộ nhớ 128GB, màn hình 11 inch 144Hz, pin 8840mAh và sạc nhanh 33W. Máy tính bảng cân bằng tốt giữa giá và trải nghiệm giải trí.",
                Price = 8_790_000, CategoryId = catTablet.Id, Material = "Nhôm", Style = "Entertainment", Color = "Gravity Gray", WeightKg = 0.49, Stock = 58, SoldCount = 84,
                MainImageUrl = "https://placehold.co/600x600?text=Xiaomi+Pad+6"
            },
            new() {
                Name = "iPad Gen 10 Wi-Fi 64GB", Slug = "ipad-gen-10-64gb",
                Description = "Chip A14 Bionic, bộ nhớ 64GB, màn hình 10.9 inch Liquid Retina và kết nối Wi‑Fi. Lựa chọn gọn nhẹ cho học online, giải trí và làm việc cơ bản.",
                Price = 9_990_000, CategoryId = catTablet.Id, Material = "Nhôm", Style = "Everyday", Color = "Silver", WeightKg = 0.477, Stock = 66, SoldCount = 112,
                MainImageUrl = "https://placehold.co/600x600?text=iPad+10"
            },
            new() {
                Name = "AirPods 4 ANC", Slug = "airpods-4-anc",
                Description = "Tai nghe Bluetooth với chống ồn chủ động, âm thanh không gian, hộp sạc USB-C và thiết kế đeo thoải mái. Tối ưu cho hệ sinh thái Apple.",
                Price = 4_990_000, CategoryId = catAudio.Id, Material = "Nhựa bóng", Style = "Lightweight", Color = "Trắng", WeightKg = 0.04, Stock = 120, SoldCount = 98,
                MainImageUrl = "https://placehold.co/600x600?text=AirPods+4+ANC"
            },
            new() {
                Name = "Samsung Galaxy Buds3 Pro", Slug = "samsung-galaxy-buds3-pro",
                Description = "Tai nghe Bluetooth với chống ồn chủ động, âm thanh Hi‑Fi 24-bit, hộp sạc USB-C và kết nối nhanh với điện thoại Samsung Galaxy.",
                Price = 4_290_000, CategoryId = catAudio.Id, Material = "Nhựa mờ", Style = "Premium Audio", Color = "Silver", WeightKg = 0.05, Stock = 64, SoldCount = 57,
                MainImageUrl = "https://placehold.co/600x600?text=Galaxy+Buds3+Pro"
            },
            new() {
                Name = "Sony WH-1000XM5", Slug = "sony-wh-1000xm5",
                Description = "Headphone Bluetooth chụp tai với chống ồn chủ động, âm thanh chi tiết, pin 30 giờ và sạc nhanh USB-C. Phù hợp làm việc, bay xa và nghe nhạc chuyên sâu.",
                Price = 7_490_000, CategoryId = catAudio.Id, Material = "Nhựa cao cấp", Style = "Over-ear", Color = "Black", WeightKg = 0.25, Stock = 28, SoldCount = 73,
                MainImageUrl = "https://placehold.co/600x600?text=Sony+WH-1000XM5"
            },
            new() {
                Name = "Marshall Minor IV", Slug = "marshall-minor-iv",
                Description = "Tai nghe Bluetooth với thiết kế đặc trưng Marshall, âm thanh sống động, pin 30 giờ và hộp sạc USB-C tiện dụng cho nhu cầu di chuyển.",
                Price = 3_290_000, CategoryId = catAudio.Id, Material = "Nhựa nhám", Style = "Lifestyle Audio", Color = "Black", WeightKg = 0.046, Stock = 46, SoldCount = 44,
                MainImageUrl = "https://placehold.co/600x600?text=Marshall+Minor+IV"
            },
            new() {
                Name = "Apple Watch Series 10 GPS 46mm", Slug = "apple-watch-series-10-gps-46mm",
                Description = "Đồng hồ thông minh với màn hình 1.96 inch, pin dùng cả ngày, GPS, Bluetooth và thiết kế nhôm mỏng nhẹ. Theo dõi sức khỏe và hoạt động thể chất tiện lợi.",
                Price = 11_990_000, CategoryId = catWatch.Id, Material = "Nhôm", Style = "Smartwatch", Color = "Jet Black", WeightKg = 0.038, Stock = 34, SoldCount = 41,
                MainImageUrl = "https://placehold.co/600x600?text=Apple+Watch+S10"
            },
            new() {
                Name = "Samsung Galaxy Watch7 44mm", Slug = "galaxy-watch7-44mm",
                Description = "Đồng hồ thông minh với màn hình 1.47 inch AMOLED, Bluetooth, GPS, pin 425mAh và nhiều cảm biến theo dõi sức khỏe hàng ngày.",
                Price = 7_990_000, CategoryId = catWatch.Id, Material = "Armor Aluminum", Style = "Smartwatch", Color = "Green", WeightKg = 0.034, Stock = 39, SoldCount = 35,
                MainImageUrl = "https://placehold.co/600x600?text=Galaxy+Watch7"
            },
            new() {
                Name = "Xiaomi Watch 2 Pro", Slug = "xiaomi-watch-2-pro",
                Description = "Đồng hồ thông minh với màn hình AMOLED 1.43 inch, Bluetooth, GPS, pin 495mAh và thiết kế cổ điển. Tập trung theo dõi luyện tập và thông báo.",
                Price = 5_490_000, CategoryId = catWatch.Id, Material = "Thép không gỉ", Style = "Smartwatch", Color = "Black", WeightKg = 0.054, Stock = 42, SoldCount = 29,
                MainImageUrl = "https://placehold.co/600x600?text=Xiaomi+Watch+2+Pro"
            },
            new() {
                Name = "Củ sạc Apple USB-C 20W", Slug = "cu-sac-apple-usb-c-20w",
                Description = "Phụ kiện sạc chính hãng với cổng USB-C, công suất 20W, kích thước gọn và tương thích tốt với iPhone, iPad, AirPods.",
                Price = 490_000, CategoryId = catPhuKien.Id, Material = "Nhựa cứng", Style = "Official Accessory", Color = "Trắng", WeightKg = 0.08, Stock = 180, SoldCount = 312,
                MainImageUrl = "https://placehold.co/600x600?text=Apple+20W"
            },
            new() {
                Name = "Sạc Anker 737 GaNPrime 120W", Slug = "sac-anker-737-120w",
                Description = "Củ sạc GaN với cổng USB-C, công suất 120W, hỗ trợ sạc nhanh nhiều thiết bị cùng lúc cho điện thoại, tablet và laptop.",
                Price = 2_190_000, CategoryId = catPhuKien.Id, Material = "Nhựa nhám", Style = "Fast Charging", Color = "Đen", WeightKg = 0.19, Stock = 54, SoldCount = 61,
                MainImageUrl = "https://placehold.co/600x600?text=Anker+737+120W"
            },
            new() {
                Name = "Cáp Baseus USB-C to USB-C 100W", Slug = "cap-baseus-usb-c-100w",
                Description = "Cáp sạc nhanh USB-C to USB-C 100W, chất liệu bện nylon bền bỉ, phù hợp điện thoại, tablet và laptop hỗ trợ Power Delivery.",
                Price = 199_000, CategoryId = catPhuKien.Id, Material = "Nylon bện", Style = "Utility", Color = "Đen", WeightKg = 0.05, Stock = 240, SoldCount = 420,
                MainImageUrl = "https://placehold.co/600x600?text=Baseus+100W+Cable"
            }
        };

        products.AddRange(new[]
        {
            new Product {
                Name = "iPhone 13 128GB", Slug = "iphone-13-128gb",
                Description = "Chip A15 Bionic, bộ nhớ 128GB, màn hình 6.1 inch Super Retina XDR, camera kép 12MP và pin đủ dùng cả ngày. Lựa chọn ổn định cho người cần iPhone ngon trong tầm giá dễ tiếp cận.",
                Price = 12_490_000, CategoryId = catIphone.Id, Material = "Nhôm/Kính", Style = "Classic", Color = "Starlight", WeightKg = 0.174, Stock = 72, SoldCount = 188,
                MainImageUrl = "https://placehold.co/600x600?text=iPhone+13"
            },
            new Product {
                Name = "Samsung Galaxy S23 FE 256GB", Slug = "samsung-galaxy-s23-fe-256gb",
                Description = "RAM 8GB, bộ nhớ 256GB, màn hình AMOLED 120Hz, camera 50MP, pin 4500mAh và sạc nhanh 25W. Phù hợp người cần cấu hình mạnh và camera tốt trong phân khúc cận cao cấp.",
                Price = 13_990_000, CategoryId = catSamsung.Id, Material = "Armor Aluminum/Kính", Style = "Fan Edition", Color = "Mint", WeightKg = 0.209, Stock = 44, SoldCount = 97,
                MainImageUrl = "https://placehold.co/600x600?text=Galaxy+S23+FE"
            },
            new Product {
                Name = "Xiaomi 14T Pro 12GB/512GB", Slug = "xiaomi-14t-pro-512gb",
                Description = "RAM 12GB, bộ nhớ 512GB, màn hình AMOLED 144Hz, camera 50MP Leica, pin 5000mAh và sạc nhanh 120W. Tối ưu cho gaming, quay chụp và hiệu năng cao.",
                Price = 17_990_000, CategoryId = catXiaomi.Id, Material = "Kính/Kim loại", Style = "Performance", Color = "Titan Gray", WeightKg = 0.198, Stock = 37, SoldCount = 54,
                MainImageUrl = "https://placehold.co/600x600?text=Xiaomi+14T+Pro"
            },
            new Product {
                Name = "OPPO Find N3 Flip 256GB", Slug = "oppo-find-n3-flip-256gb",
                Description = "RAM 12GB, bộ nhớ 256GB, màn hình gập 6.8 inch AMOLED, camera 50MP, pin 4300mAh và sạc nhanh 44W. Thiết kế gập nhỏ gọn, thời trang và linh hoạt khi chụp ảnh.",
                Price = 19_490_000, CategoryId = catOppo.Id, Material = "Kính/Kim loại", Style = "Foldable", Color = "Cream Gold", WeightKg = 0.198, Stock = 16, SoldCount = 21,
                MainImageUrl = "https://placehold.co/600x600?text=OPPO+Find+N3+Flip"
            },
            new Product {
                Name = "iPad mini 7 Wi-Fi 128GB", Slug = "ipad-mini-7-128gb",
                Description = "Máy tính bảng nhỏ gọn với màn hình 8.3 inch, bộ nhớ 128GB, pin bền bỉ và hiệu năng tốt cho ghi chú, đọc tài liệu và giải trí di động.",
                Price = 14_990_000, CategoryId = catTablet.Id, Material = "Nhôm", Style = "Compact Tablet", Color = "Purple", WeightKg = 0.293, Stock = 29, SoldCount = 36,
                MainImageUrl = "https://placehold.co/600x600?text=iPad+mini+7"
            },
            new Product {
                Name = "Apple Watch Ultra 2", Slug = "apple-watch-ultra-2",
                Description = "Đồng hồ thông minh cao cấp với vỏ titan, GPS chính xác, pin lớn và màn hình siêu sáng. Phù hợp người luyện tập thể thao và di chuyển ngoài trời.",
                Price = 20_990_000, CategoryId = catWatch.Id, Material = "Titanium", Style = "Adventure", Color = "Titanium", WeightKg = 0.061, Stock = 18, SoldCount = 24,
                MainImageUrl = "https://placehold.co/600x600?text=Watch+Ultra+2"
            },
            new Product {
                Name = "Tai nghe JBL Live Beam 3", Slug = "jbl-live-beam-3",
                Description = "Tai nghe true wireless với chống ồn chủ động, âm bass mạnh, hộp sạc màn hình tiện dụng và pin dùng lâu cho nhu cầu nghe nhạc hàng ngày.",
                Price = 3_990_000, CategoryId = catAudio.Id, Material = "Nhựa nhám", Style = "Lifestyle Audio", Color = "Blue", WeightKg = 0.052, Stock = 57, SoldCount = 49,
                MainImageUrl = "https://placehold.co/600x600?text=JBL+Live+Beam+3"
            },
            new Product {
                Name = "Pin sạc dự phòng Anker 20000mAh 30W", Slug = "anker-powerbank-20000mah-30w",
                Description = "Pin sạc dự phòng dung lượng 20000mAh, công suất 30W, hỗ trợ Power Delivery và sạc nhiều thiết bị cùng lúc. Rất hữu ích cho người thường xuyên di chuyển.",
                Price = 1_290_000, CategoryId = catPhuKien.Id, Material = "Nhựa cám", Style = "Power Accessory", Color = "Black", WeightKg = 0.35, Stock = 83, SoldCount = 126,
                MainImageUrl = "https://placehold.co/600x600?text=Anker+Powerbank+20000"
            },
            new Product {
                Name = "iPhone 12 64GB Cũ Đẹp 99%", Slug = "iphone-12-64gb-cu-dep-99",
                Description = "Máy cũ nguyên zin, hình thức đẹp 99%, chip A14 Bionic, màn hình OLED và camera kép ổn định. Lựa chọn tiết kiệm cho nhu cầu dùng iPhone bền bỉ.",
                Price = 8_490_000, CategoryId = catOld.Id, Material = "Nhôm/Kính", Style = "Refurbished", Color = "Blue", WeightKg = 0.164, Stock = 26, SoldCount = 64,
                MainImageUrl = "https://placehold.co/600x600?text=iPhone+12+Used"
            },
            new Product {
                Name = "Samsung Galaxy Z Fold6 Thom Browne Edition", Slug = "galaxy-z-fold6-thom-browne-edition",
                Description = "Phiên bản giới hạn với thiết kế đặc biệt, RAM 12GB, bộ nhớ 512GB, màn hình gập cao cấp và hiệu năng flagship. Dành cho người sưu tập và yêu thời trang công nghệ.",
                Price = 59_990_000, CategoryId = catLimited.Id, Material = "Special Edition Metal/Glass", Style = "Limited", Color = "Striped Silver", WeightKg = 0.245, Stock = 5, SoldCount = 3,
                MainImageUrl = "https://placehold.co/600x600?text=Fold6+Limited"
            }
        });

        db.Products.AddRange(products);
        await db.SaveChangesAsync();

        // ── 5. Flash Sale ─────────────────────────────────────
        var flashSale = new FlashSale
        {
            Name = "Siêu Sale Công Nghệ 2025",
            StartAt = DateTime.UtcNow,
            EndAt = DateTime.UtcNow.AddDays(3),
            IsActive = true,
            Items = new List<FlashSaleItem> {
                new() { ProductId = products[1].Id, SalePrice = 27_500_000, StockLimit = 5 },
                new() { ProductId = products[4].Id, SalePrice = 4_990_000, StockLimit = 20 }
            }
        };
        db.FlashSales.Add(flashSale);

        // ── 6. Vouchers ───────────────────────────────────────
        db.Vouchers.AddRange(
            new Voucher { Code = "MOBILE500", DiscountPercent = 0, MaxDiscountAmount = 500_000, MinOrderAmount = 10_000_000, IsActive = true, ExpiresAt = DateTime.UtcNow.AddDays(30) },
            new Voucher { Code = "TECHQUEEN", DiscountPercent = 10, MaxDiscountAmount = 200_000, MinOrderAmount = 1_000_000, IsActive = true, ExpiresAt = DateTime.UtcNow.AddDays(15) }
        );

        // ── 7. Blog Posts ─────────────────────────────────────
        db.BlogPosts.AddRange(
            new BlogPost { Title = "Đánh giá chi tiết iPhone 16 Pro Max", Slug = "danh-gia-iphone-16-pro-max", Excerpt = "Có thật sự đáng nâng cấp từ 15 Pro Max?", Content = "<p>Nội dung chi tiết...</p>", Type = "Blog", IsPublished = true },
            new BlogPost { Title = "Top 5 máy tính bảng tốt nhất cho sinh viên 2025", Slug = "top-tablet-cho-sinh-vien", Excerpt = "Lựa chọn phù hợp ngân sách và nhu cầu học tập.", Content = "<p>Nội dung chi tiết...</p>", Type = "Blog", IsPublished = true }
        );

        await db.SaveChangesAsync();
    }
}

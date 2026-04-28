# 001 — Database Schema Specification

> **Version:** 1.0.0  
> **Status:** Active  
> **Source of Truth:** `docs/PRD.md`  
> **Generated from models in:** `Web_NoiThat.Server/Models/`  
> **DbContext:** `Web_NoiThat.Server/Data/AppDbContext.cs`

---

## 1. Overview

Web_NoiThat sử dụng **SQL Server** với **Entity Framework Core** (Code-First).  
Identity được quản lý qua **ASP.NET Core Identity** (`IdentityDbContext<AppUser>`).

```
Database: Web_NoiThat (SQL Server)
ORM:  Entity Framework Core 8
Auth:     ASP.NET Core Identity
Seeding:  DbSeeder.cs (chỉ chạy khi bảng Categories trống)
```

---

## 2. Entity Relationship Diagram (ERD — Text)

```
AppUser (IdentityUser)
  ├──< Orders          (1-N)
  ├──< Appointments    (1-N)
  ├──< Reviews         (1-N)
  ├──< WishlistItems   (1-N)
  └──< BlogPosts       (1-N, AuthorId)

Category
  ├── ParentCategory   (self-ref, nullable → root category)
  ├──< SubCategories   (1-N self-ref)
  └──< Products        (1-N)

Product
  ├── Category         (N-1)
  ├──< ProductImages   (1-N, sub-images)
  ├──< OrderItems      (1-N)
  ├──< Reviews    (1-N)
  ├──< WishlistItems   (1-N)
  ├──< ProductBundles  (1-N, as main product)
  └──< FlashSaleItems  (1-N)

Order
  ├── AppUser  (N-1, nullable — guest checkout)
  └──< OrderItems      (1-N)

OrderItem
  ├── Order      (N-1)
  └── Product   (N-1)

Appointment
  └── AppUser          (N-1, nullable — anonymous booking)

Review
  ├── Product     (N-1)
  ├── AppUser     (N-1, nullable)
  └──< ReviewImages    (1-N)

WishlistItem
  ├── AppUser          (N-1)
  └── Product   (N-1)

FlashSale
  └──< FlashSaleItems  (1-N)

FlashSaleItem
  ├── FlashSale        (N-1)
  └── Product          (N-1)

ProductBundle
  ├── Product          (N-1, main product)
  └── Product       (N-1, bundled product — Restrict delete)

Voucher(standalone)
BlogPost
  └── AppUser          (N-1, nullable — AuthorId)
```

---

## 3. Tables & Columns

### 3.1 `AspNetUsers` — AppUser *(extends IdentityUser)*

| Column           | Type       | Constraints          | Description     |
|------------------|----------------|----------------------|-------------------------------------|
| `Id`             | `nvarchar(450)` | PK (Identity)       | GUID string từ Identity             |
| `UserName`       | `nvarchar(256)` | Unique             | Tên đăng nhập (= Email)       |
| `Email`          | `nvarchar(256)` | Unique     | Email đăng nhập         |
| `PasswordHash`   | `nvarchar(max)` | Nullable          | Bcrypt hash            |
| `FullName`       | `nvarchar(max)` | Required           | Họ và tên đầy đủ      |
| `AvatarUrl`      | `nvarchar(max)` | Nullable          | URL ảnh đại diện            |
| `DefaultAddress` | `nvarchar(max)` | Nullable             | Địa chỉ giao hàng mặc định    |
| `CreatedAt`      | `datetime2`     | Default: UtcNow      | Ngày tạo tài khoản                  |
| *(+ Identity columns)* | —        | —          | EmailConfirmed, PhoneNumber, v.v.   |

**Roles (AspNetRoles):** `Admin`, `Customer`

---

### 3.2 `Categories`

| Column             | Type         | Constraints       | Description        |
|--------------------|-----------------|-----------------------|---------------------------------------------|
| `Id`      | `int`           | PK, IDENTITY          |   |
| `Name`       | `nvarchar(max)` | Required              | Tên hiển thị. VD: `"Giỏ & Khay Đựng Đồ"`  |
| `Slug`         | `nvarchar(450)` | **Unique Index**      | URL-friendly. VD: `"gio-khay-dung-do"`     |
| `Description` | `nvarchar(max)` | Nullable          | Mô tả ngắn hiển thị trên trang danh mục    |
| `ImageUrl` | `nvarchar(max)` | Nullable              | Banner/thumbnail (WebP)       |
| `Icon`             | `nvarchar(max)` | Nullable              | Emoji hoặc icon class. VD: `"🧺"`           |
| `SortOrder`        | `int`   | Default: 0            | Thứ tự hiển thị trên menu (tăng dần)        |
| `IsActive`    | `bit`         | Default: 1    | Ẩn/hiện trên frontend      |
| `ParentCategoryId` | `int`           | FK → Categories(Id), Nullable, **Restrict** | Null = root category |
| `CreatedAt`        | `datetime2`     | Default: UtcNow  |         |

**Indexes:** `IX_Categories_Slug` (Unique)  
**Self-reference:** `OnDelete = Restrict` (tránh cascade cycle)

#### 🌱 Seed Data — 10 Danh Mục Gốc

| SortOrder | Name           | Slug      | Icon |
|-----------|-------------------------------|-----------------------------|------|
| 1 | Giỏ & Khay Đựng Đồ     | `gio-khay-dung-do`        | 🧺   |
| 2         | Đèn Mây Tre Trang Trí    | `den-may-tre-trang-tri`     | 🏮   |
| 3         | Đồ Nội Thất Tự Nhiên          | `do-noi-that-tu-nhien`      | 🌿   |
| 4         | Phụ Kiện Thời Trang Thủ Công  | `phu-kien-thoi-trang-thu-cong` | 👜 |
| 5       | Gương Trang Trí               | `guong-trang-tri`        | 🪞   |
| 6         | Kệ & Giá Treo Decor           | `ke-gia-treo-decor`    | 🪵   |
| 7       | Trang Trí Tường        | `trang-tri-tuong` | 🖼️  |
| 8    | Lọ Hoa & Chậu Cây Decor       | `lo-hoa-chau-cay-decor`     | 🪴   |
| 9         | Quà Tặng Thủ Công  | `qua-tang-thu-cong`     | 🎁   |
| 10      | Bộ Sưu Tập  | `bo-suu-tap` | ✨   |

#### 🌱 Seed Data — Sub-Categories (Danh Mục Con)

| Name            | Slug           | ParentSlug    | Icon |
|-------------------------|-------------------------|-------------------------|------|
| Bàn Ghế Tre Trúc        | `ban-ghe-tre-truc`      | `do-noi-that-tu-nhien`  | 🪑   |
| Kệ & Tủ Gỗ Thô          | `ke-tu-go-tho` | `do-noi-that-tu-nhien`  | 🗄️  |
| Đèn Treo Trần Mây     | `den-treo-tran-may`     | `den-may-tre-trang-tri` | 💡   |
| Đèn Bàn Tre Thủ Công    | `den-ban-tre-thu-cong`  | `den-may-tre-trang-tri` | 🕯️  |

---

### 3.3 `Products`

| Column         | Type           | Constraints     | Description   |
|----------------|------------------|--------------------------|--------------------------------------------------|
| `Id`    | `int`            | PK, IDENTITY             |                 |
| `Name`  | `nvarchar(max)`  | Required  | Tên sản phẩm   |
| `Slug`   | `nvarchar(450)`  | **Unique Index**         | VD: `"gio-dung-do-luc-binh-oval-size-l"`         |
| `Description`  | `nvarchar(max)`  | Required       | Mô tả chi tiết   |
| `Price`      | `decimal(18,2)`  | Required         | Giá gốc (VND)        |
| `SalePrice`    | `decimal(18,2)`  | Nullable     | Giá Flash Sale     |
| `IsOnSale`   | `bit`        | Default: 0         | Đang trong flash sale / khuyến mãi           |
| `LengthCm`     | `float`    | Nullable      | Chiều dài (cm)     |
| `WidthCm`      | `float`    | Nullable        | Chiều rộng (cm)              |
| `HeightCm`     | `float`      | Nullable             | Chiều cao (cm)       |
| `WeightKg`     | `float`  | Nullable   | Khối lượng (kg)        |
| `CategoryId`   | `int`            | FK → Categories(Id), Required | Danh mục       |
| `Material`     | `nvarchar(max)`  | Required       | Chất liệu — xem Enum bên dưới        |
| `Style`        | `nvarchar(max)`  | Required     | Phong cách — xem Enum bên dưới             |
| `Color`        | `nvarchar(max)`  | Required     | Màu sắc    |
| `Stock`        | `int`            | Default: 0       | Số lượng tồn kho    |
| `IsActive`     | `bit`     | Default: 1               | Hiển thị trên frontend      |
| `SoldCount`    | `int`            | Default: 0     | Số lượng đã bán (dùng cho "Bán chạy nhất")       |
| `MainImageUrl` | `nvarchar(max)`  | Required       | Ảnh chính (WebP, 800×800)       |
| `CreatedAt`    | `datetime2`      | Default: UtcNow          |      |
| `UpdatedAt`    | `datetime2`      | Default: UtcNow          | Cập nhật mỗi khi sửa sản phẩm         |

**Indexes:** `IX_Products_Slug` (Unique)

#### Enum — Material (Chất liệu)

| Giá trị (string)  | Mô tả       |
|-------------------|-------------------------------|
| `"Gỗ"`  | Gỗ tự nhiên (tràm, sồi, v.v.) |
| `"Tre"`        | Tre nguyên ống / ép thanh     |
| `"Mây"`      | Mây tự nhiên đan tay          |
| `"Lục bình"`    | Cây lục bình khô đan thủ công |
| `"Cói"`        | Cói biển tự nhiên         |
| `"Gốm"`     | Gốm nung tay    |
| `"Xi măng"`       | Bê tông / xi măng đổ tay      |
| `"Vải"`           | Vải cotton, linen, macramé    |
| `"Da"`            | Da thuộc        |
| `"Kim loại"`      | Thép, đồng, nhôm              |

#### Enum — Style (Phong cách)

| Giá trị (string)  | Mô tả          |
|-------------------|--------------------------------------------|
| `"Minimalist"`    | Tối giản, clean line       |
| `"Indochine"`     | Đông Dương, truyền thống Việt              |
| `"Scandinavian"`  | Bắc Âu / Boho-Scandi     |
| `"Classic"`       | Cổ điển, formal          |
| `"Industrial"`    | Công nghiệp, raw material          |

#### 🌱 Seed Data — Products (24 sản phẩm mẫu)

| Slug    | Category Slug    | Price (VND)  | IsOnSale |
|----------------------------------------------|-----------------------------|-------------|----------|
| `gio-dung-do-luc-binh-oval-size-l`           | `gio-khay-dung-do`    | 320,000     | ✗        |
| `khay-tre-dung-do-chu-nhat-3-ngan`        | `gio-khay-dung-do`          | 185,000     | ✔ 155k   |
| `gio-may-tron-dung-cay-noi-that`     | `gio-khay-dung-do`          | 220,000   | ✗        |
| `den-tha-tran-may-dan-lotus`                 | `den-may-tre-trang-tri`     | 890,000     | ✔ 750k   |
| `den-ban-tre-thu-cong-bamboo-desk`  | `den-may-tre-trang-tri`     | 450,000     | ✗ |
| `ban-ca-phe-go-tram-nguyen-tam-slab`         | `do-noi-that-tu-nhien`      | 3,200,000   | ✗        |
| `ghe-bap-benh-tre-rocking-bamboo`            | `do-noi-that-tu-nhien`      | 2,800,000   | ✔ 2.4M   |
| `tui-xach-coi-dan-tay-coastal`    | `phu-kien-thoi-trang-thu-cong` | 380,000  | ✗   |
| `non-coi-vanh-rong-theu-tay-bloom`    | `phu-kien-thoi-trang-thu-cong` | 290,000  | ✔ 240k   |
| `guong-tron-khung-may-boho-circle` | `guong-trang-tri`      | 650,000     | ✗    |
| `guong-da-giac-khung-go-soi-hexagon`         | `guong-trang-tri`   | 480,000     | ✗        |
| `ke-go-noi-treo-tuong-float-oak-80cm`    | `ke-gia-treo-decor`         | 420,000     | ✗        |
| `gia-treo-quan-ao-tre-rack-bamboo`           | `ke-gia-treo-decor`       | 980,000     | ✔ 820k   |
| `macrame-treo-tuong-soi-cotton-boho-wall`    | `trang-tri-tuong`         | 680,000     | ✗        |
| `phu-dieu-go-truc-chi-dieu-khac-flora` | `trang-tri-tuong`           | 1,200,000   | ✔ 980k   |
| `lo-gom-thu-cong-men-ran-wabi-sabi`          | `lo-hoa-chau-cay-decor`     | 350,000     | ✗        |
| `chau-xi-mang-thu-cong-cement-pot-set-3`     | `lo-hoa-chau-cay-decor`     | 280,000     | ✗        |
| `set-qua-tang-hop-may-tre-gift-box-premium`  | `qua-tang-thu-cong`   | 580,000  | ✗        |
| `hop-qua-cuoi-luc-binh-wedding-basket`       | `qua-tang-thu-cong`      | 450,000  | ✔ 380k   |
| `bst-tet-2025-gio-loc-dan-hoa-mai-spring`    | `bo-suu-tap`    | 520,000  | ✔ 450k   |
| `bst-mua-he-set-den-bien-ocean-breeze` | `bo-suu-tap`                | 380,000     | ✗        |

---

### 3.4 `ProductImages`

| Column      | Type            | Constraints  | Description    |
|-------------|-----------------|--------------------------|-------------------------------------|
| `Id`        | `int`     | PK, IDENTITY      |          |
| `ProductId` | `int`           | FK → Products(Id), Required | Sản phẩm chủ         |
| `Url`   | `nvarchar(max)` | Required         | URL ảnh phụ (WebP, 800×800)  |
| `AltText`   | `nvarchar(max)` | Nullable         | Alt text cho SEO / accessibility    |
| `SortOrder` | `int`           | Default: 0        | Thứ tự hiển thị (Drag & Drop Admin) |

---

### 3.5 `ProductBundles` — Sản phẩm mua kèm

| Column       | Type  | Constraints          | Description      |
|---------------------|-------|---------------------------------------|---------------------------|
| `Id`           | `int` | PK, IDENTITY                   | |
| `ProductId`      | `int` | FK → Products(Id), Cascade       | Sản phẩm chính   |
| `BundledProductId`  | `int` | FK → Products(Id), **Restrict**       | Sản phẩm gợi ý mua kèm   |

> **Lưu ý:** `BundledProductId` dùng `OnDelete = Restrict` để tránh cascade cycle.

#### 🌱 Seed Data — ProductBundles

| ProductId (Slug)         | BundledProductId (Slug)         |
|-----------------------------------------------|---------------------------------------------|
| `gio-dung-do-luc-binh-oval-size-l`     | `gio-may-tron-dung-cay-noi-that` |
| `gio-dung-do-luc-binh-oval-size-l` | `lo-gom-thu-cong-men-ran-wabi-sabi`  |
| `den-tha-tran-may-dan-lotus`          | `den-ban-tre-thu-cong-bamboo-desk`          |
| `guong-tron-khung-may-boho-circle`      | `ke-go-noi-treo-tuong-float-oak-80cm`       |
| `guong-da-giac-khung-go-soi-hexagon`      | `ke-go-noi-treo-tuong-float-oak-80cm`       |
| `set-qua-tang-hop-may-tre-gift-box-premium`   | `hop-qua-cuoi-luc-binh-wedding-basket`      |
| `bst-tet-2025-gio-loc-dan-hoa-mai-spring`     | `den-tha-tran-may-dan-lotus`   |
| `bst-tet-2025-gio-loc-dan-hoa-mai-spring`     | `bst-mua-he-set-den-bien-ocean-breeze`      |

---

### 3.6 `Orders`

| Column     | Type        | Constraints| Description           |
|-----------------------|------------------|------------------------------------------|-----------------------------------------------|
| `Id`           | `int`            | PK, IDENTITY        |       |
| `OrderCode`     | `nvarchar(max)`  | Required       | VD: `"ORD-20240101-001"`       |
| `UserId`              | `nvarchar(450)`  | FK → AspNetUsers(Id), Nullable    | Null = đặt hàng ẩn danh (guest)               |
| `Type` | `int`  | Enum `OrderType`, Default: 0             | `Retail=0`, `DesignDeposit=1`                 |
| `Status`              | `int`            | Enum `OrderStatus`, Default: 0           | Xem bảng Enum bên dưới   |
| `ReceiverName`        | `nvarchar(max)`  | Required         | Tên người nhận      |
| `ReceiverPhone`       | `nvarchar(max)`  | Required             | SĐT người nhận          |
| `ReceiverAddress`     | `nvarchar(max)`  | Required   | Địa chỉ giao hàng                |
| `TotalAmount`         | `decimal(18,2)`  | Required        | Tổng tiền hàng (trước giảm giá)     |
| `DiscountAmount`      | `decimal(18,2)`  | Default: 0          | Số tiền được giảm từ Voucher  |
| `FinalAmount`    | `decimal(18,2)`  | Required    | Tiền thực thanh toán = Total - Discount       |
| `VoucherId`           | `nvarchar(max)`  | Nullable         | Mã voucher đã áp dụng (snapshot)          |
| `VnpayTransactionId`  | `nvarchar(max)`  | Nullable   | Transaction ID từ VNPay   |
| `IsPaid`      | `bit`         | Default: 0            | Đã thanh toán qua VNPay chưa                  |
| `PaidAt`              | `datetime2`      | Nullable           | Thời điểm thanh toán thành công         |
| `CreatedAt`           | `datetime2`    | Default: UtcNow   |           |

#### Enum — OrderStatus

| Value | Name        | Mô tả         |
|-------|----------------|--------------------|
| 0     | `Pending`      | Chờ xác nhận     |
| 1     | `Processing`   | Đang xử lý         |
| 2     | `Shipping`   | Đang giao hàng     |
| 3     | `Completed`    | Hoàn thành         |
| 4     | `Cancelled`    | Đã hủy           |
| 5  | `Refunded`     | Đã hoàn tiền|

#### Enum — OrderType

| Value | Name             | Mô tả   |
|-------|------------------|---------------------------|
| 0     | `Retail`         | Mua lẻ sản phẩm|
| 1  | `DesignDeposit`  | Cọc thiết kế nội thất     |

---

### 3.7 `OrderItems`

| Column        | Type           | Constraints     | Description      |
|---------------|------------------|--------------------------|-----------------------------------------------|
| `Id`          | `int`      | PK, IDENTITY    |         |
| `OrderId`     | `int`   | FK → Orders(Id), Cascade | Đơn hàng chứa item này    |
| `ProductId`   | `int`   | FK → Products(Id)        | Sản phẩm            |
| `ProductName` | `nvarchar(max)`  | Required         | **Snapshot** tên sản phẩm lúc đặt hàng        |
| `UnitPrice` | `decimal(18,2)`  | Required        | **Snapshot** đơn giá lúc đặt hàng        |
| `Quantity`    | `int`     | Required   | Số lượng    |
| `SubTotal`    | *(computed)* | `UnitPrice × Quantity`   | Không lưu DB — tính ở runtime      |

> **Lưu ý:** `ProductName` và `UnitPrice` là **snapshot** để bảo tồn lịch sử giá khi sản phẩm thay đổi sau này.

---

### 3.8 `Appointments` — Lịch hẹn tư vấn

| Column       | Type    | Constraints       | Description       |
|-----------------------|-----------------|--------------------------------|-----------------------------------------------|
| `Id`   | `int`         | PK, IDENTITY                |      |
| `UserId`  | `nvarchar(450)` | FK → AspNetUsers(Id), Nullable | Null = đặt lịch ẩn danh           |
| `FullName`         | `nvarchar(max)` | Required  | Tên khách hàng         |
| `Phone`   | `nvarchar(max)` | Required       | Số điện thoại            |
| `Email`               | `nvarchar(max)` | Required    | Email liên hệ         |
| `Need`      | `int`     | Enum `ConsultingNeed`          | Nhu cầu tư vấn — xem Enum bên dưới  |
| `AppointmentDate`     | `datetime2`     | Required      | Ngày hẹn |
| `AppointmentTime`     | `time`          | Required         | Giờ hẹn (TimeSpan → SQL `time`)   |
| `AttachmentUrl`       | `nvarchar(max)` | Nullable        | URL file mặt bằng PDF / ảnh tham khảo         |
| `AttachmentFileName`  | `nvarchar(max)` | Nullable      | Tên file gốc khi upload          |
| `DepositAmount`       | `decimal(18,2)` | Nullable     | Số tiền cọc thiết kế (nếu có)      |
| `IsDepositPaid`       | `bit`           | Default: 0| Đã thanh toán cọc chưa         |
| `VnpayTransactionId`  | `nvarchar(max)` | Nullable         | Transaction ID VNPay thanh toán cọc|
| `LinkedOrderId`       | `int`           | Nullable        | FK gợi ý → Orders(Id) cho cọc thiết kế|
| `Status`     | `int` | Enum `AppointmentStatus`       | Trạng thái lịch hẹn         |
| `AdminNote`  | `nvarchar(max)` | Nullable             | Ghi chú nội bộ của Admin           |
| `CreatedAt`    | `datetime2`     | Default: UtcNow       |        |

#### Enum — AppointmentStatus

| Value | Name          | Mô tả        |
|-------|---------------|------------------------|
| 0     | `New`         | Mới đặt        |
| 1     | `Confirmed`   | Đã xác nhận            |
| 2     | `Completed`   | Đã tư vấn xong   |
| 3     | `Cancelled`   | Đã hủy         |

#### Enum — ConsultingNeed

| Value | Name              | Mô tả         |
|-------|-------------------|-------------------|
| 0     | `NewDesign`       | Thiết kế mới      |
| 1     | `Renovation`   | Cải tạo |
| 2 | `RetailPurchase`  | Mua lẻ            |

---

### 3.9 `Reviews`

| Column        | Type     | Constraints        | Description|
|---------------|-----------------|--------------------------------|--------------------------------------|
| `Id`          | `int`           | PK, IDENTITY   |            |
| `ProductId`   | `int`           | FK → Products(Id), Cascade     | Sản phẩm được đánh giá             |
| `UserId` | `nvarchar(450)` | FK → AspNetUsers(Id), Nullable | Null = đánh giá ẩn danh     |
| `Rating`      | `int`           | Required, Range: 1–5    | Số sao      |
| `Comment`     | `nvarchar(max)` | Required             | Nội dung bình luận   |
| `IsApproved`  | `bit`    | Default: 0      | Admin duyệt trước khi hiển thị   |
| `AdminReply`  | `nvarchar(max)` | Nullable           | Phản hồi của Admin             |
| `CreatedAt`   | `datetime2`  | Default: UtcNow      |          |

---

### 3.10 `ReviewImages`

| Column      | Type   | Constraints      | Description       |
|-------------|-----------------|------------------------------|---------------------------|
| `Id`        | `int`           | PK, IDENTITY        |        |
| `ReviewId`  | `int`           | FK → Reviews(Id), Cascade    | Review chủ |
| `Url`       | `nvarchar(max)` | Required   | URL ảnh thực tế từ khách  |

---

### 3.11 `WishlistItems`

| Column      | Type   | Constraints            | Description     |
|-------------|-----------------|--------------------------------------|-------------------------|
| `Id` | `int` | PK, IDENTITY       |     |
| `UserId`    | `nvarchar(450)` | FK → AspNetUsers(Id), Cascade        | Người dùng         |
| `ProductId` | `int`           | FK → Products(Id), Cascade           | Sản phẩm yêu thích      |
| `AddedAt`| `datetime2`     | Default: UtcNow          | Thời điểm thêm    |

**Unique Constraint:** `(UserId, ProductId)` — mỗi user chỉ lưu 1 lần mỗi sản phẩm.

---

### 3.12 `Vouchers`

| Column      | Type             | Constraints      | Description         |
|----------------------|------------------|------------------|-----------------------------------------------|
| `Id`    | `int`    | PK, IDENTITY     |          |
| `Code`         | `nvarchar(max)`  | Required         | Mã voucher. VD: `"WELCOME10"`, `"TETNEW25"`  |
| `DiscountPercent`    | `decimal(5,2)`   | Required         | % giảm giá (0–100)   |
| `MaxDiscountAmount`  | `decimal(18,2)`  | Nullable         | Giảm tối đa bao nhiêu VND|
| `MinOrderAmount`   | `decimal(18,2)`  | Nullable   | Đơn hàng tối thiểu để áp dụng         |
| `MaxUsageCount`      | `int`    | Nullable         | Số lần dùng tối đa (null = không giới hạn)    |
| `UsedCount`          | `int` | Default: 0   | Số lần đã dùng            |
| `ExpiresAt`   | `datetime2`      | Nullable     | Ngày hết hạn (null = không hết hạn)       |
| `IsActive`           | `bit`  | Default: 1| Bật/tắt voucher   |

#### 🌱 Seed Data — Vouchers

| Code     | Discount | MaxDiscount | MinOrder    | MaxUsage | Expiry    |
|----------------|----------|-------------|-------------|----------|---------------------|
| `WELCOME10`    | 10% | 200,000 đ   | 500,000 đ   | 500      | UtcNow + 3 tháng    |
| `HANDCRAFT20`  | 20%      | 500,000 đ   | 2,000,000 đ | 100      | UtcNow + 1 tháng    |
| `TETNEW25`     | 25%      | 300,000 đ   | 800,000 đ   | 200      | 2025-02-15        |

---

### 3.13 `FlashSales`

| Column      | Type        | Constraints      | Description              |
|-------------|-----------------|------------------|--------------------------------------|
| `Id`        | `int`           | PK, IDENTITY     |     |
| `Name`| `nvarchar(max)` | Required     | Tên chương trình flash sale           |
| `StartAt`   | `datetime2`     | Required         | Thời điểm bắt đầu (UTC)              |
| `EndAt`   | `datetime2`     | Required         | Thời điểm kết thúc (UTC)             |
| `IsActive`  | `bit`           | Default: 1     | Bật/tắt flash sale          |

#### 🌱 Seed Data — FlashSale

| Name       | StartAt     | EndAt    |
|----------------------------------------|-------------|--------------------|
| Flash Sale Cuối Tuần — Đồ Thủ Công    | UtcNow  | UtcNow + 2 ngày    |

---

### 3.14 `FlashSaleItems`

| Column     | Type        | Constraints   | Description        |
|----------------|------------------|----------------------------------|-------------------------------------|
| `Id`  | `int`            | PK, IDENTITY     |      |
| `FlashSaleId`  | `int`    | FK → FlashSales(Id), Cascade     | Flash sale chứa item này     |
| `ProductId`    | `int`      | FK → Products(Id), Cascade       | Sản phẩm tham gia flash sale   |
| `SalePrice`    | `decimal(18,2)`  | Required            | Giá trong flash sale                |
| `StockLimit`   | `int`            | Nullable        | Số lượng tối đa trong flash sale    |

#### 🌱 Seed Data — FlashSaleItems

| Product Slug      | SalePrice   | StockLimit |
|-------------------------------------------|-------------|------------|
| `den-tha-tran-may-dan-lotus`      | 620,000 đ   | 10      |
| `ghe-bap-benh-tre-rocking-bamboo`         | 1,980,000 đ | 5          |
| `guong-tron-khung-may-boho-circle`        | 520,000 đ   | 8          |
| `bst-tet-2025-gio-loc-dan-hoa-mai-spring` | 390,000 đ   | 50      |

---

### 3.15 `BlogPosts`

| Column     | Type            | Constraints     | Description              |
|-----------------|-----------------|--------------------------------|----------------------------------------|
| `Id`            | `int`           | PK, IDENTITY        |           |
| `Title`         | `nvarchar(max)` | Required            | Tiêu đề bài viết           |
| `Slug`          | `nvarchar(450)` | Required            | URL-friendly slug        |
| `Excerpt`       | `nvarchar(max)` | Required     | Tóm tắt ngắn (hiển thị ở listing)     |
| `Content`       | `nvarchar(max)` | Required     | Nội dung đầy đủ (HTML / Markdown)      |
| `CoverImageUrl` | `nvarchar(max)` | Nullable | Ảnh bìa (WebP, 1200×600)      |
| `AuthorId`      | `nvarchar(450)` | FK → AspNetUsers(Id), Nullable | Tác giả (Admin) |
| `IsPublished`   | `bit`       | Default: 0   | Đã xuất bản chưa     |
| `Type`          | `nvarchar(max)` | Default: `"Blog"`            | `"Blog"` hoặc `"Lookbook"` |
| `CreatedAt`     | `datetime2`     | Default: UtcNow     |      |

#### 🌱 Seed Data — BlogPosts

| Slug                | Type       | IsPublished |
|-----------------------------------------|------------|-------------|
| `xu-huong-do-thu-cong-2025-wabi-sabi`   | Blog       | ✔       |
| `lookbook-goc-nha-xanh-may-tre-la`      | Lookbook| ✔|
| `huong-dan-chon-qua-tang-thu-cong-tet`  | Blog       | ✔           |

---

## 4. Indexes Summary

| Table      | Index Name                | Columns      | Type  |
|------------------|----------------------------------|--------------------------|---------|
| `Categories`     | `IX_Categories_Slug`   | `Slug`       | Unique  |
| `Products`  | `IX_Products_Slug`               | `Slug`            | Unique  |
| `WishlistItems`  | `IX_WishlistItems_UserId_ProductId` | `(UserId, ProductId)` | Unique  |

---

## 5. Delete Behavior Rules

| Relationship        | OnDelete        | Lý do    |
|-------------------------------------------|-----------------|----------------------------------------------------|
| `Category → SubCategories` (self-ref)     | **Restrict**    | Tránh cascade cycle trên self-referencing table    |
| `ProductBundle → BundledProduct`      | **Restrict**    | Tránh cascade cycle khi xóa product        |
| `Order → OrderItems`               | Cascade         | Xóa đơn hàng → xóa hết items    |
| `FlashSale → FlashSaleItems` | Cascade   | Xóa flash sale → xóa hết items       |
| `Review → ReviewImages`| Cascade       | Xóa review → xóa hết ảnh đính kèm             |
| `WishlistItem → AppUser / Product`        | Cascade     | Xóa user/product → xóa wishlist tương ứng |

---

## 6. Admin Seed Account

| Field    | Value        |
|----------|--------------------|
| Email    | `admin@noithat.vn` |
| Password | `Admin@123456`     |
| Role | `Admin` |

> ⚠️ **Đổi mật khẩu này ngay sau khi deploy lên môi trường Production.**

---

## 7. Slug Convention

Tất cả `Slug` phải tuân theo quy tắc:

```
- Chữ thường (lowercase)
- Ký tự: a-z, 0-9, dấu gạch ngang (-)
- Không dấu tiếng Việt
- Không có dấu cách (dùng - thay thế)
- Unique trong bảng (đảm bảo bởi Unique Index)
```

**Ví dụ:** `"Giỏ & Khay Đựng Đồ"` → `"gio-khay-dung-do"`

---

## 8. Migration Commands

```bash
# Tạo migration mới
dotnet ef migrations add InitialCreate --project Web_NoiThat.Server

# Áp dụng migration lên SQL Server
dotnet ef database update --project Web_NoiThat.Server

# Xem danh sách migrations
dotnet ef migrations list --project Web_NoiThat.Server

# Rollback về migration trước
dotnet ef database update <MigrationName> --project Web_NoiThat.Server
```

---

## 9. Chú Thích Kỹ Thuật

| Vấn đề              | Giải pháp           |
|-------------------------------|--------------------------------------------------------------------------------|
| Price snapshot trong OrderItem | `ProductName` + `UnitPrice` được copy lúc đặt hàng, không đổi theo Product   |
| Guest checkout       | `Order.UserId = null`, `Appointment.UserId = null` đều hợp lệ        |
| Cascade cycles trên SQL Server | Dùng `OnDelete = Restrict` cho self-ref Category và ProductBundle        |
| Thời gian           | Tất cả `DateTime` dùng `DateTime.UtcNow` — convert sang local time ở frontend |
| Decimal precision    | `decimal(18,2)` cho tiền tệ VND; `decimal(5,2)` cho % giảm giá            |
| Seeding guard          | `DbSeeder` kiểm tra `db.Categories.AnyAsync()` trước — chỉ seed 1 lần duy nhất|

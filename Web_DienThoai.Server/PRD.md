# Product Requirements Document (PRD)

## Project: Phong Điền Mobile — Hệ thống bán lẻ Điện thoại & Công nghệ

> **Cập nhật lần cuối:** 2026-03-16  
> **Ký hiệu trạng thái:**  
> ✅ = Đã hoàn thành | ⚠️ = Hoàn thành một phần / Cần cải thiện | ❌ = Chưa triển khai

---

## Overview

Phong Điền Mobile là một nền tảng thương mại điện tử chuyên doanh điện thoại di động và phụ kiện công nghệ.
Dự án được xây dựng nhằm mục đích trưng bày các sản phẩm smartphone mới nhất,
cung cấp công cụ đặt lịch sửa chữa/hỗ trợ kỹ thuật, và cho phép khách hàng mua sắm, thanh toán trực tuyến liền mạch qua cổng VNPay.

**Stack công nghệ thực tế:**
- **Backend:** ASP.NET Core Web API + Entity Framework Core + SQL Server
- **Frontend:** React (Vite) + JSX + CSS (responsive classes via inline)
- **Authentication:** ASP.NET Identity + JWT Bearer
- **Database:** SQL Server (localhost)

---

## Goals

| # | Mục tiêu | Trạng thái |
|---|----------|-----------|
| 1 | Tối ưu hóa khả năng trưng bày sản phẩm (ảnh đa chiều, thông số kỹ thuật) | ✅ |
| 2 | Thúc đẩy tỷ lệ chuyển đổi (Đặt lịch tư vấn, Giỏ hàng, Flash Sale) | ✅ |
| 3 | Thanh toán tiện lợi qua VNPay | ⚠️ |
| 4 | Quản trị toàn diện (Dashboard Admin) | ✅ |

---

## 1. Giao diện Khách hàng (User Facing)

### 1.1 Trang chủ (HomePage)

| Tính năng | Trạng thái | Ghi chú |
|-----------|-----------|---------|
| Banner Hero thu hút | ✅ | Đã có banner hero với hình ảnh sản phẩm |
| Flash Sale (Đồng hồ đếm ngược) | ✅ | Component `FlashSaleCountdown.jsx` + API `/api/flash-sale/active` |
| Slider sản phẩm nổi bật | ✅ | Có trong `HomePage.jsx` |
| Section Cảm hứng không gian (Lookbook) | ✅ | Tích hợp Blog/Lookbook trên trang chủ |
| Hiển thị Voucher trên trang chủ | ✅ | Lấy từ API `/api/vouchers` |
| Danh sách thương hiệu đối tác (Trusted Brands) | ⚠️ | Đang dùng ảnh placeholder (`placehold.co`) |

### 1.2 Danh mục Sản phẩm (ProductListPage)

| Tính năng | Trạng thái | Ghi chú |
|-----------|-----------|---------|
| Bộ lọc theo Chất liệu (Gỗ, Da...) | ✅ | `ProductFilter.jsx` + API query `material` |
| Bộ lọc theo Phong cách (Minimalist, Indochine) | ✅ | API query `style` |
| Bộ lọc theo Khoảng giá | ✅ | API query `minPrice`, `maxPrice` |
| Bộ lọc theo Màu sắc | ✅ | API query `color` |
| Sắp xếp: Mới nhất, Giá tăng/giảm, Bán chạy nhất | ✅ | API query `sortBy` (newest, price_asc, price_desc, best_seller) |
| Phân trang (Pagination) | ✅ | API hỗ trợ `page`, `pageSize` |

### 1.3 Chi tiết Sản phẩm (ProductDetailPage)

| Tính năng | Trạng thái | Ghi chú |
|-----------|-----------|---------|
| Ảnh chính (Main Image) kích thước lớn | ✅ | `ProductGallery.jsx` |
| Dải Ảnh phụ (Sub-images) | ✅ | `ProductGallery.jsx` hiển thị danh sách ảnh phụ |
| Phóng to ảnh (Zoom/Lightbox) | ✅ | Icon `ZoomIn` + lightbox feature trong `ProductGallery` |
| Thông số kỹ thuật (Dài × Rộng × Cao, Khối lượng) | ✅ | `ProductSpecs.jsx` |
| Gợi ý "Sản phẩm mua kèm" (Bundles) | ✅ | Model `ProductBundle` + API trả về `relatedProducts` |
| Hiển thị đánh giá (Reviews) | ✅ | API trả về `reviews` với Rating, Comment |
| Thêm vào giỏ hàng | ✅ | `handleAddToCart()` + `cartStore.js` (Zustand) |

### 1.4 Hệ thống Đặt lịch Tư vấn

| Tính năng | Trạng thái | Ghi chú |
|-----------|-----------|---------|
| Form: Tên, SĐT, Email | ✅ | `AppointmentForm.jsx` |
| Nhu cầu (Thiết kế mới, Cải tạo, Mua lẻ) | ✅ | Radio buttons trong form |
| Bộ chọn Ngày (Date Picker) | ✅ | Input type=date |
| Bộ chọn Giờ (Time Picker) | ✅ | Select dropdown (08:00 - 16:00) |
| Upload file đính kèm (Mặt bằng PDF, ảnh) | ✅ | Input file + chuyển Base64 |
| API tạo lịch hẹn | ✅ | `POST /api/appointments` |
| Thanh toán phí đặt cọc giữ chỗ | ⚠️ | Model `DepositAmount`, `IsDepositPaid` tồn tại nhưng chưa tích hợp flow thanh toán cọc |

### 1.5 Giỏ hàng & Thanh toán (Checkout)

| Tính năng | Trạng thái | Ghi chú |
|-----------|-----------|---------|
| Thêm/Sửa/Xóa sản phẩm trong giỏ hàng | ✅ | `CartPage.jsx` + `cartStore.js` (Zustand persist) |
| Nhập mã giảm giá (Voucher) | ✅ | API `POST /api/vouchers/validate` + áp dụng trong `CartPage` |
| Form thông tin giao hàng (Tên, SĐT, Địa chỉ) | ✅ | `CheckoutPage.jsx` |
| Thanh toán qua VNPay (QR, ATM, Thẻ tín dụng) | ⚠️ | Endpoint VNPay IPN (`/api/orders/vnpay-ipn`) đã có, nhưng **chưa có** logic tạo VNPay payment URL thực tế (TODO checksum HMAC) |
| One-click checkout cho khách đã đăng nhập | ❌ | Chưa triển khai lưu thông tin thanh toán |
| Thanh toán phí đặt cọc cho tư vấn thiết kế | ⚠️ | Model hỗ trợ (`OrderType.DesignDeposit`) nhưng chưa có flow thanh toán riêng |
| Tạo đơn hàng (Guest checkout) | ✅ | `POST /api/orders` — không bắt buộc đăng nhập |

### 1.6 Tương tác & Cá nhân hóa

| Tính năng | Trạng thái | Ghi chú |
|-----------|-----------|---------|
| Đăng ký tài khoản (Email) | ✅ | `POST /api/auth/register` + `LoginPage.jsx` |
| Đăng nhập (Email) | ✅ | `POST /api/auth/login` + JWT |
| Đăng nhập qua Google (OAuth) | ❌ | Chưa triển khai |
| Quản lý đơn hàng/lịch hẹn cá nhân | ✅ | API `GET /api/orders/my`, `GET /api/appointments/my` |
| Đánh giá & Nhận xét (1-5 sao, bình luận) | ⚠️ | Model `Review` + `ReviewImage` đã có, API trả reviews trong product detail, nhưng **chưa có endpoint POST** để tạo review từ client |
| Upload ảnh thực tế (trong review) | ⚠️ | Model `ReviewImage` đã có nhưng chưa có API/UI tạo review |
| Lưu Danh sách Yêu thích (Wishlist) | ⚠️ | Model `WishlistItem` đã có, icon Heart trên Header, nhưng **chưa có API Controller** và UI quản lý wishlist |
| Thanh tìm kiếm (Search bar) | ✅ | Header có search bar + API `GET /api/products/search?q=` |
| Auto-suggest khi tìm kiếm | ❌ | Chỉ có tìm kiếm cơ bản, chưa có auto-suggest (gợi ý kết quả khi gõ) |

---

## 2. Giao diện Quản trị viên (Admin Dashboard)

### 2.1 Dashboard Tổng quan

| Tính năng | Trạng thái | Ghi chú |
|-----------|-----------|---------|
| Trang Dashboard tổng quan | ✅ | `AdminDashboard.jsx` |

### 2.2 Quản lý Sản phẩm

| Tính năng | Trạng thái | Ghi chú |
|-----------|-----------|---------|
| CRUD sản phẩm | ✅ | `AdminProducts.jsx` + API POST/PUT/DELETE |
| Phân loại danh mục | ✅ | `CategoriesController` + `categoriesStore.js` |
| Quản lý tồn kho (Stock) | ✅ | Field `Stock` trong model Product |
| Kéo thả (Drag & Drop) sắp xếp ảnh | ❌ | Chưa triển khai tính năng kéo thả ảnh |

### 2.3 Quản lý Lịch hẹn

| Tính năng | Trạng thái | Ghi chú |
|-----------|-----------|---------|
| Xem danh sách đặt lịch | ✅ | `AdminAppointments.jsx` + API `GET /api/appointments` |
| Tải file đính kèm mặt bằng của khách | ⚠️ | Field `AttachmentUrl` tồn tại nhưng upload thực tế lưu Base64, chưa có server-side file storage |
| Cập nhật trạng thái xử lý | ✅ | API `PUT /api/appointments/{id}/status` |
| Ghi chú Admin | ✅ | Field `AdminNote` trong request |

### 2.4 Quản lý Đơn hàng & Thanh toán

| Tính năng | Trạng thái | Ghi chú |
|-----------|-----------|---------|
| Danh sách đơn hàng (mua lẻ/tiền cọc) | ✅ | `AdminOrders.jsx` + API `GET /api/orders` (paged, filter by status) |
| Cập nhật trạng thái đơn hàng | ✅ | API `PUT /api/orders/{id}/status` |
| Đối soát VNPay (Webhook/IPN) | ⚠️ | Endpoint `POST /api/orders/vnpay-ipn` tồn tại nhưng **chưa verify HMAC checksum** (có comment TODO) |
| Xử lý hoàn tiền (Refund) | ❌ | Chưa triển khai |

### 2.5 Quản lý Khuyến mãi (Marketing)

| Tính năng | Trạng thái | Ghi chú |
|-----------|-----------|---------|
| Khởi tạo Flash Sale (mốc thời gian, sản phẩm) | ✅ | `AdminPromotions.jsx` + FlashSale model/seeder |
| Tạo Mã giảm giá (Voucher) | ✅ | `AdminPromotions.jsx` + `VouchersController` |
| Validate voucher | ✅ | API `POST /api/vouchers/validate` |

### 2.6 Quản lý Đánh giá & Nội dung

| Tính năng | Trạng thái | Ghi chú |
|-----------|-----------|---------|
| Duyệt/ẩn bình luận của khách | ✅ | `AdminReviews.jsx` + Model `IsApproved` |
| Phản hồi đánh giá (Admin Reply) | ✅ | Field `AdminReply` trong model Review |
| Đăng tải bài viết Blog/Lookbook | ✅ | `AdminBlog.jsx` + `BlogController` |

---

## 3. Hạ tầng Kỹ thuật & Backend

### 3.1 Database

| Tính năng | Trạng thái | Ghi chú |
|-----------|-----------|---------|
| SQL Server chạy localhost | ✅ | Cấu hình trong `appsettings.json` |
| Auto Migration khi khởi động | ✅ | `db.Database.Migrate()` trong `Program.cs` |
| Data Seeder (dữ liệu mẫu) | ✅ | `DbSeeder.cs` (33KB — seed phong phú) |
| Database Schema Spec | ✅ | `docs/specs/001-database-schema.md` |

### 3.2 API & Authentication

| Tính năng | Trạng thái | Ghi chú |
|-----------|-----------|---------|
| JWT Authentication | ✅ | Cấu hình trong `Program.cs` |
| Role-based Authorization (Admin/User) | ✅ | `[Authorize(Roles = "Admin")]` trên các endpoint admin |
| Swagger UI (API documentation) | ✅ | Swagger tại `/swagger` trong Development |
| CORS cho Vite client | ✅ | `AllowViteClient` policy |

### 3.3 API Testing

| Tính năng | Trạng thái | Ghi chú |
|-----------|-----------|---------|
| Postman Collection (JSON) | ✅ | `docs/specs/WebNoiThat.postman_collection.json` |

### 3.4 Data Model

| Tính năng | Trạng thái | Ghi chú |
|-----------|-----------|---------|
| Bảng Category (quan hệ 1-N với Product) | ✅ | Model `Category.cs` + 10 danh mục theo PRD |
| Bảng Product (kích thước, chất liệu, giá, tồn kho) | ✅ | `Product.cs` đầy đủ fields |
| Bảng Order + OrderItem | ✅ | `Order.cs`, `OrderItem.cs` |
| Bảng Appointment | ✅ | `Appointment.cs` |
| Bảng Review + ReviewImage | ✅ | `Review.cs`, `ReviewImage.cs` |
| Bảng Voucher | ✅ | `Voucher.cs` |
| Bảng WishlistItem | ✅ | `WishlistItem.cs` |
| Bảng ProductBundle (mua kèm) | ✅ | `ProductBundle.cs` |
| Bảng ProductImage (ảnh phụ) | ✅ | `ProductImage.cs` |
| Bảng BlogPost | ✅ | `BlogPost.cs` |
| Bảng FlashSale + FlashSaleItem | ✅ | Trong Data model |
| Bảng AppUser (extends IdentityUser) | ✅ | `AppUser.cs` |

---

## 4. Danh sách Categories

| STT | Tên Danh Mục | Slug | Trạng thái |
|-----|-------------|------|-----------|
| 1 | iPhone | iphone | ✅ |
| 2 | Samsung | samsung | ✅ |
| 3 | Xiaomi | xiaomi | ✅ |
| 4 | OPPO | oppo | ✅ |
| 5 | iPad & Máy tính bảng | ipad-tablet | ✅ |
| 6 | Phụ kiện Sạc, Cáp | phu-kien-sac-cap | ✅ |
| 7 | Tai nghe (Audio) | tai-nghe-audio | ✅ |
| 8 | Đồng hồ thông minh | dong-ho-thông-minh | ✅ |
| 9 | Máy cũ giá rẻ | may-cu-gia-re | ✅ |
| 10 | Bộ sưu tập Limited | bo-suu-tap-limited | ✅ |

---

## 5. Yêu cầu Phi chức năng (Non-Functional Requirements)

| Yêu cầu | Trạng thái | Ghi chú |
|----------|-----------|---------|
| Tốc độ tải trang dưới 3s | ⚠️ | Vite build tối ưu, nhưng chưa đo lường chính thức (Lighthouse) |
| Hình ảnh tự động nén sang WebP | ⚠️ | Assets sử dụng `.webp` trong imageMap, nhưng chưa có pipeline tự động nén server-side |
| Responsive (Mobile, Tablet, Desktop) | ⚠️ | Có sử dụng responsive classes (grid-cols, md:, flex-wrap) nhưng chưa có `@media` queries đầy đủ trong CSS gốc |
| Validate chặt chẽ form đầu vào | ✅ | Form validation ở cả Frontend (required, type) và Backend (model validation) |
| Bảo vệ route Admin (Authentication) | ✅ | `[Authorize(Roles = "Admin")]` trên tất cả endpoint admin |
| Checksum bảo mật VNPay trên Server | ❌ | Có TODO comment nhưng **chưa triển khai** verify HMAC |

---

## 6. Ngoài phạm vi (Out of Scope)

- ❌ Công cụ thiết kế 3D/AR trực tiếp trên web
- ❌ Ứng dụng di động Native (iOS/Android)

---

## 7. Tổng kết Tiến độ

### Tổng quan nhanh

| Hạng mục | Hoàn thành | Một phần | Chưa làm | Tổng |
|----------|-----------|---------|---------|------|
| Giao diện Khách hàng | 19 | 6 | 3 | 28 |
| Giao diện Admin | 11 | 2 | 2 | 15 |
| Hạ tầng & Backend | 16 | 0 | 0 | 16 |
| Phi chức năng | 2 | 3 | 1 | 6 |
| **Tổng cộng** | **48** | **11** | **6** | **65** |

### Tỷ lệ hoàn thành: **~74% hoàn thành đầy đủ** | **~91% đã triển khai (bao gồm một phần)**

### Các hạng mục ưu tiên cần hoàn thiện

1. **🔴 VNPay Integration** — Tạo payment URL + verify HMAC checksum (bảo mật quan trọng)
2. **🔴 Review/Rating API** — Thêm endpoint `POST /api/reviews` để khách hàng tạo đánh giá
3. **🟡 Wishlist API** — Thêm `WishlistController` (CRUD cho danh sách yêu thích)
4. **🟡 Google OAuth** — Tích hợp đăng nhập qua Google
5. **🟡 Auto-suggest Search** — Thêm gợi ý tìm kiếm real-time
6. **🟡 Drag & Drop ảnh** — Tính năng kéo thả sắp xếp ảnh trong Admin
7. **🟡 Refund/Hoàn tiền** — API xử lý hoàn tiền qua VNPay
8. **🟢 One-click Checkout** — Lưu thông tin thanh toán cho khách đã đăng nhập


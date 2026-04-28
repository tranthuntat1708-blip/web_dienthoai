# Cấu trúc dự án Web_NoiThat
# ASP.NET Core 8 (Server) + React 19 / Vite (Client)

Web_NoiThat/
│
├── docs/
│   ├── PRD.md       # Product Requirements Document
│   ├── specs/
│   │   └── project-structure.md        # File này
│   └── archive/
│
├── openspec.config.yaml
│
# ════════════════════════════════════════
# BACKEND — ASP.NET Core 8 Web API
# ════════════════════════════════════════
├── Web_NoiThat.Server/
│   │
│   ├── Models/     # Entity / Domain Models (EF Core)
│   │   ├── AppUser.cs             # IdentityUser mở rộng
│   │   ├── Product.cs       # Sản phẩm (Giá, Kích thước, Chất liệu)
│   │   ├── ProductImage.cs          # Ảnh phụ (Sub-images + SortOrder)
│   │   ├── ProductBundle.cs         # "Sản phẩm mua kèm"
│   │   ├── Category.cs            # Danh mục (tự tham chiếu)
│   │   ├── Order.cs         # Đơn hàng (Retail + DesignDeposit)
│   │   ├── OrderItem.cs      # Dòng sản phẩm trong đơn hàng
│   │   ├── Appointment.cs         # Lịch hẹn tư vấn + upload file
│   │   ├── Review.cs + ReviewImage.cs  # Đánh giá + ảnh thực tế
│   │   ├── WishlistItem.cs    # Danh sách yêu thích
│ │   ├── Voucher.cs       # Mã giảm giá + Flash Sale
│   │   └── BlogPost.cs       # Bài viết Blog / Lookbook
│   │
│   ├── DTOs/              # Request/Response shapes (luồng Client↔Server)
│   │   ├── ProductDtos.cs    # ProductCard, ProductDetail, FilterRequest
│   │   ├── OrderDtos.cs      # CartItem, CreateOrderRequest, OrderSummary
│   │   ├── AppointmentDtos.cs          # CreateAppointmentRequest, ReviewDto
│   │   └── CommonDtos.cs     # Auth, VNPay IPN, VoucherValidation
│   │
│ ├── Data/
│   │   └── AppDbContext.cs  # EF Core DbContext + Identity
│   │
│   ├── Controllers/
│   │   ├── ProductsController.cs       # GET /products (filter+paging), GET /products/{slug}
│   │   ├── OrdersController.cs         # POST /orders, GET /orders/my, VNPay IPN
│   │   ├── AppointmentsController.cs   # POST/GET /appointments
│   │ └── WeatherForecastController.cs
│   │
│   ├── Services/             # Business Logic (TODO)
│   │   ├── IVnpayService.cs            # Tạo URL thanh toán, verify checksum
│   │   ├── IFileStorageService.cs      # Upload file mặt bằng
│   │   └── IEmailService.cs           # Gửi email xác nhận lịch hẹn
│   │
│   └── Program.cs
│
# ════════════════════════════════════════
# FRONTEND — React 19 + Vite
# ════════════════════════════════════════
└── web_noithat.client/
    ├── src/
    │   │
    │   ├── types/        # TypeScript interfaces (schema dữ liệu)
    │   │   ├── product.ts  # ProductCard, ProductDetail, ProductFilterParams
    │   │   ├── order.ts                # CartItem, OrderSummary, OrderDetail
    │   │   └── appointment.ts          # AppointmentDto, CreateAppointmentPayload
    │   │
    │   ├── api/  # Axios API layer (luồng Client→Server)
    │   │   ├── client.ts      # Axios instance + JWT interceptor
    │   │   ├── products.ts# getProducts(), getProduct(slug), search()
    │   │   ├── orders.ts      # createOrder(), getMyOrders(), validateVoucher()
    │   │   └── appointments.ts    # create(), getMyAppointments()
    │   │
    │   ├── components/
    │   │   ├── product/
    │   │ │   ├── ProductCard.jsx     # Card sản phẩm (grid/slider) + flash sale badge
    │   │   │   ├── ProductGallery.jsx  # Ảnh chính + dải ảnh phụ + Lightbox/Zoom
    │   │   │   ├── ProductSpecs.jsx    # Bảng thông số kỹ thuật (D×R×C, KL, Chất liệu)
    │   │   │   └── ProductFilter.jsx   # Bộ lọc đa chiều (Chất liệu, Phong cách, Giá)
    │   │   │
    │   │   ├── appointment/
    │   │   │   └── AppointmentForm.jsx # Form đặt lịch + Date/Time Picker + File upload
    │   │   │
    │   │   ├── cart/ # (TODO) CartDrawer, CartItem, VoucherInput
    │   │   ├── checkout/      # (TODO) CheckoutForm, VNPayRedirect
    │   │   ├── admin/      # (TODO) Dashboard, ProductCrudForm, OrderTable
    │   │   └── common/
    │   │       └── FlashSaleCountdown.jsx  # Đồng hồ đếm ngược
  │   │
    │   ├── pages/      # (TODO) Route-level pages
    │   │   ├── HomePage.jsx
    │   │   ├── ProductListPage.jsx
    │   │   ├── ProductDetailPage.jsx
    │   │   ├── CartPage.jsx
    │   │   ├── CheckoutPage.jsx
    │   │   ├── AppointmentPage.jsx
    │   │   └── admin/
    │   │       ├── DashboardPage.jsx
    │   │       ├── ProductsAdminPage.jsx
    │   │└── OrdersAdminPage.jsx
 │   │
    │   ├── store/     # (TODO) Zustand / Context (cart, auth, wishlist)
    │   ├── utils/
    │   │   └── format.ts    # formatVnd(), formatDate()
    │   │
 │   └── main.jsx
    │
    └── package.json

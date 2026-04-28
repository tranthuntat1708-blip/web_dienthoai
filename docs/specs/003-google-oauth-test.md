# 003 — Hướng dẫn Test API (Postman)

> **Base URL:** `https://localhost:7001/api`  
> **Auth:** JWT Bearer Token  
> **Admin account:** `admin@noithat.vn` / `Admin@123456`

---

## Mục lục

| # | Module | Endpoints |
|---|--------|-----------|
| 1 | [Auth](#1-auth) | Register, Login, Google Login, Me |
| 2 | [Categories](#2-categories) | Danh sách, Chi tiết |
| 3 | [Products](#3-products) | Danh sách, Tìm kiếm, Chi tiết, CRUD Admin |
| 4 | [Orders](#4-orders) | Tạo đơn, Đơn của tôi, Chi tiết, Admin list, Cập nhật trạng thái |
| 5 | [Appointments](#5-appointments) | Đặt lịch, Lịch của tôi, Admin list, Cập nhật trạng thái |
| 6 | [Vouchers](#6-vouchers) | Danh sách, Validate |
| 7 | [Flash Sale](#7-flash-sale) | Flash sale đang diễn ra |
| 8 | [Blog](#8-blog) | Danh sách, Chi tiết |
| 9 | [Wishlist](#9-wishlist) | Danh sách, IDs, Check, Thêm, Xóa, Toggle |

---

## Cài đặt Postman

### Collection Variables

| Variable | Initial Value |
|----------|---------------|
| `base_url` | `https://localhost:7001/api` |
| `jwt_token` | *(tự động set sau login)* |
| `admin_token` | *(tự động set sau admin login)* |
| `google_token` | *(paste thủ công — xem mục 1.3)* |

### Authorization (Collection level)

- Type: **Bearer Token**
- Token: `{{jwt_token}}`

### Auto-save JWT (Tests script)

Thêm vào tab **Tests** của mỗi request Login/Register/Google:

```javascript
if (pm.response.code === 200) {
    var json = pm.response.json();
    pm.collectionVariables.set("jwt_token", json.token);
    // Nếu là Admin, lưu riêng
    if (json.role === "Admin") {
        pm.collectionVariables.set("admin_token", json.token);
    }
}
```

---

## 1. Auth

### 1.1 Đăng ký — `POST /auth/register`

```
POST {{base_url}}/auth/register
Content-Type: application/json
```

**Body:**

```json
{
  "fullName": "Nguyễn Văn Test",
  "email": "test@example.com",
  "password": "Test123456"
}
```

**✅ 200 OK:**

```json
{
  "token": "eyJ...",
  "userId": "...",
  "fullName": "Nguyễn Văn Test",
  "email": "test@example.com",
  "role": "Customer"
}
```

**❌ 400 — Email đã tồn tại:**

```json
{ "message": "Email đã được sử dụng." }
```

---

### 1.2 Đăng nhập — `POST /auth/login`

```
POST {{base_url}}/auth/login
Content-Type: application/json
```

**Body (Customer):**

```json
{
  "email": "test@example.com",
  "password": "Test123456"
}
```

**Body (Admin):**

```json
{
  "email": "admin@noithat.vn",
  "password": "Admin@123456"
}
```

**✅ 200 OK:**

```json
{
  "token": "eyJ...",
  "userId": "...",
  "fullName": "Admin",
  "email": "admin@noithat.vn",
  "role": "Admin"
}
```

**❌ 401 — Sai thông tin:**

```json
{ "message": "Email hoặc mật khẩu không đúng." }
```

---

### 1.3 Đăng nhập Google — `POST /auth/google`

> **Cách lấy Google ID Token:**
> 1. Mở frontend `https://localhost:61348/dang-nhap`
> 2. Mở DevTools → Network
> 3. Click **"Sign in with Google"**
> 4. Tìm request `POST /api/auth/google` → copy `idToken` từ Payload

```
POST {{base_url}}/auth/google
Content-Type: application/json
```

**Body:**

```json
{
  "idToken": "{{google_token}}"
}
```

**✅ 200 OK:**

```json
{
  "token": "eyJ...",
  "userId": "...",
  "fullName": "Tên từ Google",
  "email": "user@gmail.com",
  "role": "Customer"
}
```

**❌ 401 — Token không hợp lệ / hết hạn:**

```json
{ "message": "Token Google không hợp lệ." }
```

---

### 1.4 Thông tin User hiện tại — `GET /auth/me`

```
GET {{base_url}}/auth/me
Authorization: Bearer {{jwt_token}}
```

**✅ 200 OK:**

```json
{
  "token": "eyJ...",
  "userId": "...",
  "fullName": "Nguyễn Văn Test",
  "email": "test@example.com",
  "role": "Customer"
}
```

**❌ 401 — Chưa đăng nhập hoặc token hết hạn**

---

## 2. Categories

### 2.1 Danh sách danh mục — `GET /categories`

```
GET {{base_url}}/categories
```

**✅ 200 OK:**

```json
[
  {
    "id": 1,
    "name": "Giỏ & Khay Đựng Đồ",
    "slug": "gio-khay-dung-do",
    "description": "...",
    "imageUrl": "...",
    "icon": "🧺",
    "sortOrder": 1,
    "productCount": 3
  }
]
```

---

### 2.2 Chi tiết danh mục — `GET /categories/{slug}`

```
GET {{base_url}}/categories/gio-khay-dung-do
```

**✅ 200 OK:** Trả về 1 CategoryDto  
**❌ 404 — Slug không tồn tại**

---

## 3. Products

### 3.1 Danh sách sản phẩm (filter + sort + paging) — `GET /products`

```
GET {{base_url}}/products?page=1&pageSize=12
```

**Query params tùy chọn:**

| Param | Ví dụ | Mô tả |
|-------|-------|-------|
| `categoryId` | `1` | Lọc theo danh mục |
| `categorySlug` | `gio-khay-dung-do` | Lọc theo slug danh mục |
| `q` | `giỏ` | Tìm kiếm theo tên |
| `material` | `Mây` | Lọc theo chất liệu |
| `style` | `Minimalist` | Lọc theo phong cách |
| `color` | `Nâu` | Lọc theo màu sắc |
| `minPrice` | `100000` | Giá tối thiểu |
| `maxPrice` | `500000` | Giá tối đa |
| `sortBy` | `price_asc` | Sắp xếp: `newest`, `price_asc`, `price_desc`, `best_seller` |
| `page` | `1` | Trang |
| `pageSize` | `12` | Số sản phẩm / trang |

**✅ 200 OK:**

```json
{
  "total": 24,
  "page": 1,
  "pageSize": 12,
  "items": [
    {
      "id": 1,
      "name": "Giỏ Đựng Đồ Lục Bình Oval Size L",
      "slug": "gio-dung-do-luc-binh-oval-size-l",
      "mainImageUrl": "...",
      "price": 320000,
      "salePrice": null,
      "isOnSale": false,
      "material": "Lục bình",
      "style": "Minimalist",
      "color": "Nâu tự nhiên",
      "soldCount": 0,
      "averageRating": null,
      "reviewCount": 0
    }
  ]
}
```

---

### 3.2 Tìm kiếm sản phẩm — `GET /products/search`

```
GET {{base_url}}/products/search?q=đèn
```

**✅ 200 OK:** Trả về danh sách `ProductCardDto[]`

---

### 3.3 Chi tiết sản phẩm — `GET /products/{slug}`

```
GET {{base_url}}/products/gio-dung-do-luc-binh-oval-size-l
```

**✅ 200 OK:**

```json
{
  "id": 1,
  "name": "Giỏ Đựng Đồ Lục Bình Oval Size L",
  "slug": "...",
  "description": "...",
  "mainImageUrl": "...",
  "subImages": [],
  "price": 320000,
  "salePrice": null,
  "isOnSale": false,
  "stock": 25,
  "lengthCm": 40,
  "widthCm": 30,
  "heightCm": 15,
  "weightKg": 0.8,
  "material": "Lục bình",
  "style": "Minimalist",
  "color": "Nâu tự nhiên",
  "category": { "id": 1, "name": "...", "slug": "..." },
  "bundledProducts": [],
  "latestReviews": [],
  "averageRating": null,
  "reviewCount": 0
}
```

**❌ 404 — Slug không tồn tại**

---

### 3.4 Thêm sản phẩm (Admin) — `POST /products`

```
POST {{base_url}}/products
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

**Body:**

```json
{
  "name": "Sản Phẩm Test",
  "slug": "san-pham-test",
  "description": "Mô tả sản phẩm test",
  "price": 150000,
  "salePrice": null,
  "categoryId": 1,
  "material": "Mây",
  "style": "Minimalist",
  "color": "Nâu",
  "stock": 10,
  "mainImageUrl": "https://placehold.co/800x800",
  "lengthCm": 20,
  "widthCm": 15,
  "heightCm": 10,
  "weightKg": 0.5
}
```

**✅ 200 OK:** Trả về `ProductCardDto`  
**❌ 401/403 — Không phải Admin**

---

### 3.5 Sửa sản phẩm (Admin) — `PUT /products/{id}`

```
PUT {{base_url}}/products/1
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

**Body:** *(giống 3.4)*

**✅ 204 No Content**  
**❌ 404 — Không tìm thấy sản phẩm**

---

### 3.6 Xóa sản phẩm (Admin) — `DELETE /products/{id}`

```
DELETE {{base_url}}/products/1
Authorization: Bearer {{admin_token}}
```

**✅ 204 No Content**  
**❌ 404 — Không tìm thấy sản phẩm**

---

## 4. Orders

### 4.1 Tạo đơn hàng — `POST /orders`

> Không bắt buộc đăng nhập (guest checkout)

```
POST {{base_url}}/orders
Content-Type: application/json
```

**Body:**

```json
{
  "type": "Retail",
  "receiverName": "Nguyễn Văn A",
  "receiverPhone": "0901234567",
  "receiverAddress": "123 Đường ABC, Q.1, TP.HCM",
  "voucherCode": null,
  "items": [
    {
      "productId": 1,
      "productName": "Giỏ Đựng Đồ Lục Bình Oval Size L",
      "mainImageUrl": "",
      "unitPrice": 320000,
      "quantity": 2
    }
  ]
}
```

**✅ 200 OK:**

```json
{
  "orderSummary": {
    "id": 1,
    "orderCode": "ORD-20260304-1234",
    "status": "Pending",
    "finalAmount": 640000,
    "isPaid": false,
    "createdAt": "..."
  },
  "paymentUrl": null
}
```

**❌ 400 — Giỏ hàng trống:**

```json
{ "message": "Giỏ hàng trống." }
```

---

### 4.2 Tạo đơn hàng có Voucher — `POST /orders`

```json
{
  "type": "Retail",
  "receiverName": "Nguyễn Văn A",
  "receiverPhone": "0901234567",
  "receiverAddress": "123 Đường ABC",
  "voucherCode": "WELCOME10",
  "items": [
    {
      "productId": 1,
      "productName": "Giỏ Đựng Đồ Lục Bình Oval Size L",
      "mainImageUrl": "",
      "unitPrice": 320000,
      "quantity": 2
    }
  ]
}
```

**Kiểm tra:** `finalAmount` = `totalAmount` - `discountAmount` (giảm 10%, tối đa 200,000đ)

---

### 4.3 Đơn hàng của tôi — `GET /orders/my` 🔒

```
GET {{base_url}}/orders/my
Authorization: Bearer {{jwt_token}}
```

**✅ 200 OK:** Trả về `OrderSummaryDto[]`

---

### 4.4 Chi tiết đơn hàng — `GET /orders/{id}` 🔒

```
GET {{base_url}}/orders/1
Authorization: Bearer {{jwt_token}}
```

**✅ 200 OK:** Trả về `OrderDetailDto`  
**❌ 404 — Đơn hàng không tồn tại hoặc không thuộc user**

---

### 4.5 Tất cả đơn hàng (Admin) — `GET /orders` 🔒👑

```
GET {{base_url}}/orders?page=1&pageSize=20&status=Pending
Authorization: Bearer {{admin_token}}
```

**Query params:**

| Param | Ví dụ | Mô tả |
|-------|-------|-------|
| `page` | `1` | Trang |
| `pageSize` | `20` | Số đơn / trang |
| `status` | `Pending` | Lọc: `Pending`, `Processing`, `Shipping`, `Completed`, `Cancelled`, `Refunded` |

**✅ 200 OK:**

```json
{
  "total": 5,
  "page": 1,
  "pageSize": 20,
  "items": [...]
}
```

---

### 4.6 Cập nhật trạng thái đơn (Admin) — `PUT /orders/{id}/status` 🔒👑

```
PUT {{base_url}}/orders/1/status
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

**Body:**

```json
{
  "status": "Processing"
}
```

**✅ 204 No Content**  
**❌ 400 — Trạng thái không hợp lệ**  
**❌ 404 — Đơn hàng không tồn tại**

---

### 4.7 VNPay IPN Callback — `POST /orders/vnpay-ipn`

> ⚠️ Endpoint này được VNPay server gọi, không cần Auth

```
POST {{base_url}}/orders/vnpay-ipn?vnp_TmnCode=ABC&vnp_Amount=64000000&vnp_BankCode=NCB&vnp_BankTranNo=VNP100&vnp_CardType=ATM&vnp_PayDate=20260304&vnp_OrderInfo=Thanhtoan&vnp_TransactionNo=TXN001&vnp_ResponseCode=00&vnp_TransactionStatus=00&vnp_TxnRef=ORD-20260304-1234&vnp_SecureHash=test
```

**✅ 200 OK:**

```json
{ "rspCode": "00", "message": "Confirm success" }
```

---

## 5. Appointments

### 5.1 Đặt lịch tư vấn — `POST /appointments`

> Không bắt buộc đăng nhập

```
POST {{base_url}}/appointments
Content-Type: application/json
```

**Body:**

```json
{
  "fullName": "Trần Văn B",
  "phone": "0909876543",
  "email": "tranvanb@example.com",
  "need": "NewDesign",
  "appointmentDate": "2026-03-10T00:00:00Z",
  "appointmentTime": "10:00",
  "attachmentBase64": null,
  "attachmentFileName": null
}
```

**Giá trị `need`:** `NewDesign`, `Renovation`, `RetailPurchase`

**✅ 200 OK:**

```json
{
  "id": 1,
  "fullName": "Trần Văn B",
  "phone": "0909876543",
  "email": "tranvanb@example.com",
  "need": "NewDesign",
  "appointmentDate": "2026-03-10T00:00:00Z",
  "appointmentTime": "10:00",
  "attachmentUrl": null,
  "status": "New",
  "depositAmount": null,
  "isDepositPaid": false,
  "createdAt": "..."
}
```

---

### 5.2 Lịch hẹn của tôi — `GET /appointments/my` 🔒

```
GET {{base_url}}/appointments/my
Authorization: Bearer {{jwt_token}}
```

**✅ 200 OK:** Trả về `AppointmentDto[]`

---

### 5.3 Tất cả lịch hẹn (Admin) — `GET /appointments` 🔒👑

```
GET {{base_url}}/appointments?page=1&pageSize=20&status=New
Authorization: Bearer {{admin_token}}
```

**Query params:**

| Param | Ví dụ | Mô tả |
|-------|-------|-------|
| `page` | `1` | Trang |
| `pageSize` | `20` | Số lịch hẹn / trang |
| `status` | `New` | Lọc: `New`, `Confirmed`, `Completed`, `Cancelled` |

**✅ 200 OK:**

```json
{
  "total": 3,
  "page": 1,
  "items": [...]
}
```

---

### 5.4 Cập nhật trạng thái (Admin) — `PUT /appointments/{id}/status` 🔒👑

```
PUT {{base_url}}/appointments/1/status
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

**Body:**

```json
{
  "status": "Confirmed",
  "adminNote": "Xác nhận hẹn 10:00 ngày 10/03"
}
```

**✅ 204 No Content**

---

## 6. Vouchers

### 6.1 Danh sách voucher công khai — `GET /vouchers`

```
GET {{base_url}}/vouchers
```

**✅ 200 OK:**

```json
[
  {
    "code": "WELCOME10",
    "discountPercent": 10,
    "maxDiscountAmount": 200000,
    "minOrderAmount": 500000,
    "expiresAt": "2026-06-04T..."
  },
  {
    "code": "HANDCRAFT20",
    "discountPercent": 20,
    "maxDiscountAmount": 500000,
    "minOrderAmount": 2000000,
    "expiresAt": "2026-04-04T..."
  }
]
```

---

### 6.2 Validate voucher — `POST /vouchers/validate`

```
POST {{base_url}}/vouchers/validate
Content-Type: application/json
```

**Body:**

```json
{
  "code": "WELCOME10",
  "orderAmount": 600000
}
```

**✅ Hợp lệ:**

```json
{
  "isValid": true,
  "discountAmount": 60000,
  "message": null
}
```

**❌ Không hợp lệ - mã sai:**

```json
{
  "isValid": false,
  "discountAmount": 0,
  "message": "Mã giảm giá không hợp lệ hoặc đã hết hạn."
}
```

**❌ Không hợp lệ - đơn hàng quá nhỏ:**

```json
{
  "isValid": false,
  "discountAmount": 0,
  "message": "Đơn hàng tối thiểu 500,000đ để dùng mã này."
}
```

---

## 7. Flash Sale

### 7.1 Flash sale đang diễn ra — `GET /flash-sale/active`

```
GET {{base_url}}/flash-sale/active
```

**✅ 200 OK:**

```json
{
  "id": 1,
  "name": "Flash Sale Cuối Tuần — Đồ Thủ Công",
  "startAt": "...",
  "endAt": "...",
  "items": [
    {
      "productId": 4,
      "productName": "Đèn Tha Trần Mây Đan Lotus",
      "productSlug": "den-tha-tran-may-dan-lotus",
      "mainImageUrl": "...",
      "originalPrice": 890000,
      "salePrice": 620000,
      "stockLimit": 10,
      "averageRating": null,
      "reviewCount": 0,
      "soldCount": 0
    }
  ]
}
```

**❌ 404 — Không có flash sale nào đang diễn ra**

---

## 8. Blog

### 8.1 Danh sách bài viết — `GET /blog`

```
GET {{base_url}}/blog?type=Blog&page=1&pageSize=6
```

**Query params:**

| Param | Ví dụ | Mô tả |
|-------|-------|-------|
| `type` | `Blog` hoặc `Lookbook` | Lọc loại bài viết |
| `page` | `1` | Trang |
| `pageSize` | `6` | Số bài / trang |

**✅ 200 OK:**

```json
{
  "total": 2,
  "page": 1,
  "pageSize": 6,
  "items": [
    {
      "id": 1,
      "title": "Xu Hướng Đồ Thủ Công 2025: Wabi-Sabi",
      "slug": "xu-huong-do-thu-cong-2025-wabi-sabi",
      "excerpt": "...",
      "coverImageUrl": "...",
      "type": "Blog",
      "createdAt": "..."
    }
  ]
}
```

---

### 8.2 Chi tiết bài viết — `GET /blog/{slug}`

```
GET {{base_url}}/blog/xu-huong-do-thu-cong-2025-wabi-sabi
```

**✅ 200 OK:** Trả về `BlogPostDetailDto` (bao gồm `content`)  
**❌ 404 — Slug không tồn tại hoặc bài chưa publish**

---

## 9. Wishlist

> ⚠️ Tất cả endpoint Wishlist đều yêu cầu đăng nhập (`Authorization: Bearer {{jwt_token}}`)

### 9.1 Danh sách yêu thích — `GET /wishlist` 🔒

```
GET {{base_url}}/wishlist
Authorization: Bearer {{jwt_token}}
```

**✅ 200 OK:**

```json
[
  {
    "id": 1,
    "productId": 4,
    "productName": "Đèn Tha Trần Mây Đan Lotus",
    "slug": "den-tha-tran-may-dan-lotus",
    "mainImageUrl": "...",
    "price": 890000,
    "salePrice": 750000,
    "isOnSale": true,
    "stock": 15,
    "categoryName": "Đèn Mây Tre Trang Trí",
    "addedAt": "..."
  }
]
```

---

### 9.2 Lấy danh sách Product ID yêu thích — `GET /wishlist/ids` 🔒

```
GET {{base_url}}/wishlist/ids
Authorization: Bearer {{jwt_token}}
```

**✅ 200 OK:**

```json
[4, 7, 10]
```

---

### 9.3 Kiểm tra sản phẩm trong wishlist — `GET /wishlist/check/{productId}` 🔒

```
GET {{base_url}}/wishlist/check/4
Authorization: Bearer {{jwt_token}}
```

**✅ 200 OK:**

```json
{ "isInWishlist": true }
```

---

### 9.4 Thêm vào yêu thích — `POST /wishlist/{productId}` 🔒

```
POST {{base_url}}/wishlist/4
Authorization: Bearer {{jwt_token}}
```

**✅ 200 OK:**

```json
{ "message": "Đã thêm vào danh sách yêu thích!", "id": 1 }
```

**⚠️ 200 — Đã tồn tại:**

```json
{ "message": "Sản phẩm đã có trong danh sách yêu thích.", "alreadyExists": true }
```

**❌ 404 — Sản phẩm không tồn tại**

---

### 9.5 Xóa khỏi yêu thích — `DELETE /wishlist/{productId}` 🔒

```
DELETE {{base_url}}/wishlist/4
Authorization: Bearer {{jwt_token}}
```

**✅ 200 OK:**

```json
{ "message": "Đã xóa khỏi danh sách yêu thích." }
```

**❌ 404 — Sản phẩm không có trong wishlist**

---

### 9.6 Toggle yêu thích — `POST /wishlist/toggle/{productId}` 🔒

```
POST {{base_url}}/wishlist/toggle/4
Authorization: Bearer {{jwt_token}}
```

**✅ 200 OK — Đã thêm:**

```json
{ "isInWishlist": true, "message": "Đã thêm vào danh sách yêu thích!" }
```

**✅ 200 OK — Đã xóa:**

```json
{ "isInWishlist": false, "message": "Đã xóa khỏi danh sách yêu thích." }
```

---

## Checklist tổng hợp

### Ký hiệu: 🔓 = Public | 🔒 = Cần JWT | 👑 = Admin only

| # | Method | Endpoint | Auth | Pass? |
|---|--------|----------|------|-------|
| **Auth** |
| 1.1 | POST | `/auth/register` | 🔓 | ⬜ |
| 1.2 | POST | `/auth/login` (Customer) | 🔓 | ⬜ |
| 1.2b | POST | `/auth/login` (Admin) | 🔓 | ⬜ |
| 1.3 | POST | `/auth/google` | 🔓 | ⬜ |
| 1.4 | GET | `/auth/me` | 🔒 | ⬜ |
| **Categories** |
| 2.1 | GET | `/categories` | 🔓 | ⬜ |
| 2.2 | GET | `/categories/{slug}` | 🔓 | ⬜ |
| **Products** |
| 3.1 | GET | `/products` | 🔓 | ⬜ |
| 3.2 | GET | `/products/search?q=` | 🔓 | ⬜ |
| 3.3 | GET | `/products/{slug}` | 🔓 | ⬜ |
| 3.4 | POST | `/products` | 👑 | ⬜ |
| 3.5 | PUT | `/products/{id}` | 👑 | ⬜ |
| 3.6 | DELETE | `/products/{id}` | 👑 | ⬜ |
| **Orders** |
| 4.1 | POST | `/orders` | 🔓 | ⬜ |
| 4.2 | POST | `/orders` (với voucher) | 🔓 | ⬜ |
| 4.3 | GET | `/orders/my` | 🔒 | ⬜ |
| 4.4 | GET | `/orders/{id}` | 🔒 | ⬜ |
| 4.5 | GET | `/orders` (Admin) | 👑 | ⬜ |
| 4.6 | PUT | `/orders/{id}/status` | 👑 | ⬜ |
| 4.7 | POST | `/orders/vnpay-ipn` | 🔓 | ⬜ |
| **Appointments** |
| 5.1 | POST | `/appointments` | 🔓 | ⬜ |
| 5.2 | GET | `/appointments/my` | 🔒 | ⬜ |
| 5.3 | GET | `/appointments` (Admin) | 👑 | ⬜ |
| 5.4 | PUT | `/appointments/{id}/status` | 👑 | ⬜ |
| **Vouchers** |
| 6.1 | GET | `/vouchers` | 🔓 | ⬜ |
| 6.2 | POST | `/vouchers/validate` | 🔓 | ⬜ |
| **Flash Sale** |
| 7.1 | GET | `/flash-sale/active` | 🔓 | ⬜ |
| **Blog** |
| 8.1 | GET | `/blog` | 🔓 | ⬜ |
| 8.2 | GET | `/blog/{slug}` | 🔓 | ⬜ |
| **Wishlist** |
| 9.1 | GET | `/wishlist` | 🔒 | ⬜ |
| 9.2 | GET | `/wishlist/ids` | 🔒 | ⬜ |
| 9.3 | GET | `/wishlist/check/{productId}` | 🔒 | ⬜ |
| 9.4 | POST | `/wishlist/{productId}` | 🔒 | ⬜ |
| 9.5 | DELETE | `/wishlist/{productId}` | 🔒 | ⬜ |
| 9.6 | POST | `/wishlist/toggle/{productId}` | 🔒 | ⬜ |

**Tổng: 28 endpoints**

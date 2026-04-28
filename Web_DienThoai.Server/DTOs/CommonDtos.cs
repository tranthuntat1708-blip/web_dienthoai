namespace Web_NoiThat.Server.DTOs;

// ── VNPAY ─────────────────────────────────────────────────

/// <summary>
/// Trả về URL thanh toán VNPay để Client redirect
/// </summary>
public record VnpayPaymentUrlResponse(string PaymentUrl);

/// <summary>
/// VNPay Webhook callback từ VNPay server (IPN)
/// </summary>
public record VnpayIpnRequest(
    string vnp_TmnCode,
    string vnp_Amount,
    string vnp_BankCode,
    string vnp_BankTranNo,
    string vnp_CardType,
    string vnp_PayDate,
    string vnp_OrderInfo,
    string vnp_TransactionNo,
    string vnp_ResponseCode,
    string vnp_TransactionStatus,
    string vnp_TxnRef,
    string vnp_SecureHash
);

// ── AUTH ──────────────────────────────────────────────────

public record RegisterRequest(
    string FullName,
    string Email,
    string Password
);

public record LoginRequest(
    string Email,
    string Password
);

public record GoogleLoginRequest(string IdToken);

public record AuthResponse(
    string Token,
    string UserId,
    string FullName,
    string Email,
    string Role
);

// ── VOUCHER ───────────────────────────────────────────────

public record ValidateVoucherRequest(string Code, decimal OrderAmount);
public record VoucherValidationResult(bool IsValid, decimal DiscountAmount, string? Message);

/// <summary>
/// Thông tin voucher công khai hiển thị trên trang chủ / danh sách mã giảm giá.
/// </summary>
public record PublicVoucherDto(
    string Code,
    decimal DiscountPercent,
    decimal? MaxDiscountAmount,
    decimal? MinOrderAmount,
    DateTime? ExpiresAt);

// ── WISHLIST ──────────────────────────────────────────────

public record WishlistItemDto(
    int Id,
    int ProductId,
    string ProductName,
    string Slug,
    string? MainImageUrl,
    decimal Price,
    decimal? SalePrice,
    bool IsOnSale,
    int Stock,
    string? CategoryName,
    DateTime AddedAt);

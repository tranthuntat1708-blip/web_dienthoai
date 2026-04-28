namespace Web_NoiThat.Server.DTOs;

// ── CART (Client-side state, gửi lên khi checkout) ───────

public record CartItemDto(
    int ProductId,
  string ProductName,
    string MainImageUrl,
    decimal UnitPrice,
    int Quantity
);

// ── ORDER REQUEST ─────────────────────────────────────────

public class CreateOrderRequest
{
    public OrderType Type { get; init; } = OrderType.Retail;
    public string ReceiverName { get; init; } = string.Empty;
    public string ReceiverPhone { get; init; } = string.Empty;
    public string ReceiverAddress { get; init; } = string.Empty;
    public string PaymentMethod { get; init; } = "vnpay";
    public string? VoucherCode { get; init; }
    public IEnumerable<CartItemDto> Items { get; init; } = Array.Empty<CartItemDto>();
}

public enum OrderType { Retail, DesignDeposit }

// ── ORDER RESPONSE ────────────────────────────────────────

public record OrderSummaryDto(
    int Id,
    string OrderCode,
    string Status,
    decimal FinalAmount,
    string PaymentMethod,
    bool IsPaid,
  DateTime CreatedAt
);

public record OrderDetailDto(
    int Id,
    string OrderCode,
    string Status,
    string ReceiverName,
    string ReceiverPhone,
    string ReceiverAddress,
    decimal TotalAmount,
    decimal DiscountAmount,
    decimal FinalAmount,
    string PaymentMethod,
    bool IsPaid,
    string? VnpayTransactionId,
    IEnumerable<CartItemDto> Items,
    DateTime CreatedAt
);

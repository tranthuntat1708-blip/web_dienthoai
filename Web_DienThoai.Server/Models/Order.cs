namespace Web_NoiThat.Server.Models;

public enum OrderStatus
{
    Pending,        // Chờ xác nhận
    Processing,     // Đang xử lý
    Shipping,       // Đang giao hàng
    Completed, // Hoàn thành
 Cancelled,    // Đã hủy
    Refunded        // Đã hoàn tiền
}

public enum OrderType
{
    Retail,    // Mua lẻ sản phẩm
    DesignDeposit   // Cọc thiết kế
}

public class Order
{
    public int Id { get; set; }
    public string OrderCode { get; set; } = string.Empty;  // VD: ORD-20240101-001
    public string? UserId { get; set; }
    public AppUser? User { get; set; }

    public OrderType Type { get; set; } = OrderType.Retail;
    public OrderStatus Status { get; set; } = OrderStatus.Pending;

    // --- Thông tin nhận hàng ---
    public string ReceiverName { get; set; } = string.Empty;
    public string ReceiverPhone { get; set; } = string.Empty;
    public string ReceiverAddress { get; set; } = string.Empty;

    // --- Thanh toán ---
    public decimal TotalAmount { get; set; }
    public decimal DiscountAmount { get; set; } = 0;
    public decimal FinalAmount { get; set; }
    public string PaymentMethod { get; set; } = "VNPay";
    public string? VoucherId { get; set; }
    public string? VnpayTransactionId { get; set; }
    public bool IsPaid { get; set; } = false;
    public DateTime? PaidAt { get; set; }

    public ICollection<OrderItem> Items { get; set; } = [];
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

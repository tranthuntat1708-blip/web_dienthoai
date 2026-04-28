namespace Web_NoiThat.Server.Models;

public enum AppointmentStatus
{
    New,        // Mới đặt
    Confirmed,  // Đã xác nhận
    Completed,  // Đã tư vấn xong
    Cancelled   // Đã hủy
}

public enum ConsultingNeed
{
    NewDesign,      // Thiết kế mới
    Renovation,     // Cải tạo
    RetailPurchase  // Mua lẻ
}

/// <summary>
/// Lịch hẹn tư vấn thiết kế - kèm file đính kèm (mặt bằng PDF/ảnh tham khảo)
/// </summary>
public class Appointment
{
    public int Id { get; set; }
    public string? UserId { get; set; }
    public AppUser? User { get; set; }

  public string FullName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
public string Email { get; set; } = string.Empty;
    public ConsultingNeed Need { get; set; }

    public DateTime AppointmentDate { get; set; }
    public TimeSpan AppointmentTime { get; set; }

    // File mặt bằng hoặc ảnh tham khảo
    public string? AttachmentUrl { get; set; }
    public string? AttachmentFileName { get; set; }

    // Cọc thiết kế (nếu có)
    public decimal? DepositAmount { get; set; }
    public bool IsDepositPaid { get; set; } = false;
    public string? VnpayTransactionId { get; set; }
    public int? LinkedOrderId { get; set; }

    public AppointmentStatus Status { get; set; } = AppointmentStatus.New;
    public string? AdminNote { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

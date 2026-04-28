using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Web_NoiThat.Server.Data;
using Web_NoiThat.Server.DTOs;
using Web_NoiThat.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Web_NoiThat.Server.Controllers;

/// <summary>
/// POST /api/appointments       - Khách đặt lịch tư vấn (kèm upload file)
/// GET  /api/appointments       - Admin: xem danh sách (Authorize Admin)
/// PUT  /api/appointments/{id}/status - Admin: cập nhật trạng thái
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AppointmentsController : ControllerBase
{
    private readonly AppDbContext _db;
    public AppointmentsController(AppDbContext db) => _db = db;

    // POST /api/appointments — Khách đặt lịch (ẩn danh hoặc đã đăng nhập)
    [HttpPost]
    public async Task<ActionResult<AppointmentDto>> CreateAppointment(
        [FromBody] CreateAppointmentRequest req)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!Enum.TryParse<ConsultingNeed>(req.Need, out var need))
            return BadRequest(new { message = "Nhu cầu tư vấn không hợp lệ." });

        if (!TimeSpan.TryParse(req.AppointmentTime, out var appointmentTime))
            return BadRequest(new { message = "Giờ hẹn không đúng định dạng HH:mm." });

        var appointment = new Appointment
        {
            UserId = userId,
            FullName = req.FullName,
            Phone = req.Phone,
            Email = req.Email,
            Need = need,
            AppointmentDate = req.AppointmentDate.ToUniversalTime(),
            AppointmentTime = appointmentTime,
            AttachmentFileName = req.AttachmentFileName,
            Status = AppointmentStatus.New,
            CreatedAt = DateTime.UtcNow,
        };

        _db.Appointments.Add(appointment);
        await _db.SaveChangesAsync();

        return Ok(MapToDto(appointment));
    }

    // GET /api/appointments/my — User xem lịch hẹn của mình
    [HttpGet("my")]
    [Authorize]
    public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetMyAppointments()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var list = await _db.Appointments
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();

        return Ok(list.Select(MapToDto));
    }

    // GET /api/appointments — Admin: xem tất cả
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<object>> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? status = null)
    {
        var query = _db.Appointments.AsQueryable();

        if (!string.IsNullOrEmpty(status) && Enum.TryParse<AppointmentStatus>(status, out var st))
            query = query.Where(a => a.Status == st);

        var total = await query.CountAsync();
        var items = await query
            .OrderByDescending(a => a.CreatedAt)
            .Skip((page - 1) * pageSize).Take(pageSize)
            .ToListAsync();

        return Ok(new { Total = total, Page = page, Items = items.Select(MapToDto) });
    }

    // PUT /api/appointments/{id}/status — Admin: cập nhật trạng thái
    [HttpPut("{id:int}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> UpdateStatus(int id, [FromBody] UpdateAppointmentStatusRequest req)
    {
        var a = await _db.Appointments.FindAsync(id);
        if (a is null) return NotFound();

        if (!Enum.TryParse<AppointmentStatus>(req.Status, out var newStatus))
            return BadRequest(new { message = "Trạng thái không hợp lệ." });

        a.Status = newStatus;
        a.AdminNote = req.AdminNote;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private static AppointmentDto MapToDto(Appointment a) => new(
        a.Id, a.FullName, a.Phone, a.Email, a.Need.ToString(),
        a.AppointmentDate, a.AppointmentTime.ToString(@"hh\:mm"),
        a.AttachmentUrl, a.Status.ToString(),
        a.DepositAmount, a.IsDepositPaid, a.CreatedAt);
}

public record UpdateAppointmentStatusRequest(string Status, string? AdminNote);

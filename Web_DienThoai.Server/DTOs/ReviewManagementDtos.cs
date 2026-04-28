namespace Web_NoiThat.Server.DTOs;

public record AdminReviewDto(
    int Id,
    int ProductId,
    string ProductName,
    string UserName,
    string? UserAvatarUrl,
    int Rating,
    string Comment,
    IEnumerable<string> Images,
    bool IsApproved,
    string? AdminReply,
    DateTime CreatedAt
);

public record ReviewReplyRequest(string Reply);

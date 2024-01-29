using backend.Entities;

namespace backend;

public class History
{
    public int Id { get; set; }

    public required ApplicationUser Author { get; set; }

    public required Chats Chats { get; set; }

    public required DateTime SentOn { get; set; }

    public required string Message { get; set; } = string.Empty;
}

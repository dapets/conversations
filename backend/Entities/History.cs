using backend.Entities;

namespace backend;

public record HistoryDto(int Id, ApplicationUserDto Author, int ChatId, DateTime SentOn, string Message);

public class History : IGetDto<HistoryDto>
{
    public int Id { get; set; }

    public required ApplicationUser Author { get; set; }

    public required Chats Chats { get; set; }

    public required DateTime SentOn { get; set; }

    public required string Message { get; set; } = string.Empty;

    public HistoryDto GetDto() => new(Id, Author.GetDto(), Chats.Id, SentOn, Message);
}

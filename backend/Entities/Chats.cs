namespace backend.Entities;

public record ChatRoomDto(int Id, IEnumerable<ApplicationUserDto> Members, HistoryDto? LastMessage);

public partial class Chats : IGetDto<ChatRoomDto>
{
    public int Id { get; set; }

    public required ICollection<History> History { get; set; } = new List<History>();

    public required ICollection<ApplicationUser> Members { get; set; } = new List<ApplicationUser>();

    public ChatRoomDto GetDto()
    {
        var lastMessage = History
            .OrderBy(h => h.SentOn)
            .LastOrDefault();

        HistoryDto? lastMessageDto = null;
        if (lastMessage is not null)
        {
            lastMessageDto = lastMessage.GetDto();
        }

        return new(Id, Members.Select(m => m.GetDto()), lastMessageDto);
    }
}

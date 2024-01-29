namespace backend.Entities;

public record ChatRoomDto(int Id, IEnumerable<ApplicationUserDto> Members, HistoryDto LastMessage);

public partial class Chats : IGetDto<ChatRoomDto>
{
    public int Id { get; set; }

    public required ICollection<History> History { get; set; } = new List<History>();

    public required ICollection<ApplicationUser> Members { get; set; } = new List<ApplicationUser>();

    public ChatRoomDto GetDto() => new(
        Id,
        Members.Select(m => m.GetDto()),
        History
            .OrderBy(h => h.SentOn)
            .Last()
            .GetDto()
    );
}

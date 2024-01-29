namespace backend.Entities;

public record ChatRoomDto(int Id, IEnumerable<ApplicationUserDto> Members, HistoryDto? LastMessage);

public partial class Chats
{
    public int Id { get; set; }

    public ICollection<History> History { get; set; } = new List<History>();

    public required ICollection<ApplicationUser> Members { get; set; } = new List<ApplicationUser>();
}
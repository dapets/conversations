using Microsoft.AspNetCore.Identity;

namespace backend.Entities;

public record ApplicationUserDto(string Id, string FirstName, string LastName, string? Email);

public class ApplicationUser : IdentityUser, IGetDto<ApplicationUserDto>
{
    [PersonalData]
    public string FirstName { get; set; } = string.Empty;

    [PersonalData]
    public string LastName { get; set; } = string.Empty;

    [PersonalData]
    public ICollection<History> SentMessages { get; set; } = [];

    [PersonalData]
    public ICollection<Chats> Chats { get; set; } = [];

    public ApplicationUserDto GetDto() => new(Id, FirstName, LastName, Email);
}

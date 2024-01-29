using Microsoft.AspNetCore.Identity;

namespace backend.Entities;

public class ApplicationUser : IdentityUser
{
    [PersonalData]
    public string FirstName { get; set; } = string.Empty;

    [PersonalData]
    public string LastName { get; set; } = string.Empty;

    [PersonalData]
    public ICollection<History> SentMessages { get; set; } = new List<History>();

    [PersonalData]
    public ICollection<Chats> Chats { get; set; } = new List<Chats>();
}

using Microsoft.AspNetCore.Identity;

namespace backend.Entities;

public class ApplicationUser : IdentityUser
{
    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public ICollection<History> SentMessages { get; set; } = new List<History>();

    public ICollection<Chats> Chats { get; set; } = new List<Chats>();
}

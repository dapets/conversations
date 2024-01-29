using Microsoft.AspNetCore.Identity;

namespace backend.Entities;

public class User : IdentityUser
{
    public required string FirstName { get; set; }

    public required string LastName { get; set; }

    public ICollection<History> SentMessages { get; set; } = new List<History>();

    public ICollection<Chats> Chats { get; set; } = new List<Chats>();
}

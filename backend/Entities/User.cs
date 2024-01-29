namespace backend.Entities;

public class User
{
    public int Id { get; set; }

    public required string FirstName { get; set; }

    public required string LastName { get; set; }

    public ICollection<History> SentMessages { get; set; } = new List<History>();

    public ICollection<Chats> Chats { get; set; } = new List<Chats>();
}

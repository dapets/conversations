namespace backend.Entities;

public class User
{
    public int Id { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public required ICollection<Chats> Chats { get; set; }
}

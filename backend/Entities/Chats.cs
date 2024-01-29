namespace backend.Entities;

public partial class Chats
{
    public int Id { get; set; }

    public required ICollection<User> Members { get; set; }
}

using Microsoft.EntityFrameworkCore;

namespace backend.Entities;

public partial class DevContext : DbContext
{
    public DevContext()
    {
    }

    public DevContext(DbContextOptions<DevContext> options)
        : base(options)
    {
    }

    public DbSet<Chats> Chats { get; set; }

    public DbSet<User> Users { get; set; }

    public DbSet<History> History { get; set; }
}

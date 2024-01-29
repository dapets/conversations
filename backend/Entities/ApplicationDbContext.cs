using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace backend.Entities;

public partial class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext()
    {
    }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Chats> Chats { get; set; }

    public DbSet<History> History { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        //interferes with AspNetCore Identity which needs to set the username directly
        // builder.Entity<ApplicationUser>()
        //     .Property(u => u.UserName)
        //     .HasComputedColumnSql("[FirstName] || ' ' || [LastName]");

        base.OnModelCreating(builder);
    }
}

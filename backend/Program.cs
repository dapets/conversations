using backend;
using backend.Entities;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApplicationDbContext>(
    options => options.UseSqlite(builder.Configuration.GetConnectionString("ApplicationDbContext"))
);
builder.Services.AddSignalR();
builder.Services.AddCors(config =>
{
    config.AddDefaultPolicy(configurePolicy =>
    {
        configurePolicy.WithOrigins("http://localhost:3000");
        configurePolicy.AllowCredentials();
        configurePolicy.AllowAnyHeader();
    });
});

if (builder.Environment.IsDevelopment())
{
    builder.Services.AddDatabaseDeveloperPageExceptionFilter();
}

var loggedInUserId = "177";

var app = builder.Build();

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.MapHub<ChatHub>("/chatHub");

app.MapGet("/whoami", (ApplicationDbContext db) =>
    db.Users.FirstAsync(u => u.Id == loggedInUserId)
);

app.MapGet("/chats", (ApplicationDbContext db) => db
    .Chats
    .Include(c => c.Members)
    .Where(c => c.Members.Any(m => m.Id == loggedInUserId))
    .Select(c => c.Members)
    .AsAsyncEnumerable()
);

app.MapGet("/chats/{id}", (string id, ApplicationDbContext db) =>
{
    var commonChatHistory = db.Chats
        .Where(c => c.Members.Any(m => m.Id == id))
        .Where(c => c.Members.Any(m => m.Id == loggedInUserId))
        .Include(c => c.History)
        .ThenInclude(h => h.Author)
        //We are creating a dto to avoid cyclic references when serializing
        .SelectMany(c => c.History)
        .Select(h => new
        {
            h.Id,
            h.Message,
            h.SentOn,
            h.Author
        })
        .ToListAsync();

    return commonChatHistory;
});

app.Run();

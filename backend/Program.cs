using backend.Entities;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<DevContext>();
// builder.Services.Configure<JsonOptions>(options =>
// {
//     options.SerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
//     options.SerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
// });

if (builder.Environment.IsDevelopment())
{
    builder.Services.AddDatabaseDeveloperPageExceptionFilter();
}

var loggedInUserId = 177;

var app = builder.Build();

app.MapGet("/chats", (DevContext db) => db
    .Chats
    .Include(c => c.Members)
    .Where(c => c.Members.Any(m => m.Id == loggedInUserId))
    .Select(c => c.Members)
    .AsAsyncEnumerable()
);

app.MapGet("/chats/{id}", (int id, DevContext db) =>
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

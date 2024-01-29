using System.Security.Claims;
using backend.Entities;
using backend.Hubs;
using backend.Utils;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApplicationDbContext>(
    options => options.UseSqlite(builder.Configuration.GetConnectionString("ApplicationDbContext"))
);
builder.Services.AddCors(config =>
{
    config.AddDefaultPolicy(configurePolicy =>
    {
        configurePolicy.WithOrigins("http://localhost:3000");
        configurePolicy.AllowCredentials();
        configurePolicy.AllowAnyHeader();
    });
});
builder.Services.AddAuthorization();
builder.Services.AddIdentityApiEndpoints<ApplicationUser>()
    .AddEntityFrameworkStores<ApplicationDbContext>();
builder.Services.AddScoped<IdentityUtils>();

builder.Services.AddSignalR();

if (builder.Environment.IsDevelopment())
{
    builder.Services.AddDatabaseDeveloperPageExceptionFilter();
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();
}

var app = builder.Build();

app.UseCors();
app.MapIdentityApi<ApplicationUser>();

app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHsts();
}

app.MapHub<ChatHub>("/chatHub")
    .RequireAuthorization();

app.MapGet("/whoami", (ClaimsPrincipal claimsPrincipal, IdentityUtils utils) =>
{
    return utils.GetUserAsync(claimsPrincipal);
})
.RequireAuthorization();

app.MapGet("/chats", async (ClaimsPrincipal claimsPrincipal, IdentityUtils utils, ApplicationDbContext db) =>
{
    var loggedInUser = await utils.GetUserAsync(claimsPrincipal);
    return db
    .Chats
    .Include(c => c.Members)
    .Where(c => c.Members.Contains(loggedInUser))
    .Select(c => c.Members)
    .AsAsyncEnumerable();
}
)
.RequireAuthorization();

app.MapGet("/chats/{id}/history", async (ClaimsPrincipal claimsPrincipal, IdentityUtils utils, string id, ApplicationDbContext db) =>
{
    var loggedInUser = await utils.GetUserAsync(claimsPrincipal);
    var commonChatHistory = await db.Chats
        .Where(chats => chats.Members.Any(m => m.Id == id))
        .Where(chats => chats.Members.Contains(loggedInUser))
        .Include(chats => chats.History)
        .ThenInclude(history => history.Author)
        .SelectMany(chats => chats.History)
        .OrderBy(history => history.SentOn)
        //We are creating a dto to avoid cyclic references when serializing
        .Select(history => new
        {
            history.Id,
            history.Message,
            history.SentOn,
            author = new
            {
                id = history.Author.Id,
                history.Author.FirstName,
                history.Author.LastName,
            }
        })
        .ToListAsync();

    return commonChatHistory;
})
.RequireAuthorization();

app.Run();

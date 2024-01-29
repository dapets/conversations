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

app.MapGet("/whoami", async (ClaimsPrincipal claimsPrincipal, IdentityUtils utils) =>
{
    var loggedInUser = await utils.GetUserAsync(claimsPrincipal);
    return loggedInUser.GetDto();
})
.RequireAuthorization();

app.MapGet("/chats", async (ClaimsPrincipal claimsPrincipal, IdentityUtils utils, ApplicationDbContext db) =>
{
    var loggedInUser = await utils.GetUserAsync(claimsPrincipal);
    return db
    .Chats
    .Include(c => c.Members)
    .Include(c => c.History)
    .Where(c => c.Members.Contains(loggedInUser))
    .Select(chat => chat.GetDto())
    .AsAsyncEnumerable();
})
.RequireAuthorization();

app.MapGet("/chats/{chatId}", async (ClaimsPrincipal claimsPrincipal, IdentityUtils utils, int chatId, ApplicationDbContext db) =>
{
    var loggedInUser = await utils.GetUserAsync(claimsPrincipal);
    var chat = await db.Chats
        .Include(chats => chats.History)
        .ThenInclude(history => history.Author)
        .ThenInclude(history => history.Chats)
        .Include(chats => chats.Members)
        //Chat.GetDto() includes lastMessage, but we need the full history here
        .Select(chat => new
        {
            id = chat.Id,
            members = chat.Members.Select(m => m.GetDto()),
            history = chat.History.Select(h => h.GetDto()),
        })
        .FirstAsync(c => c.id == chatId);

    return chat;
})
.RequireAuthorization();

app.Run();

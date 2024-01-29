using System.Security.Claims;
using backend;
using backend.Entities;
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
    return utils.GetUser(claimsPrincipal);
})
.RequireAuthorization();

app.MapGet("/chats", async (ClaimsPrincipal claimsPrincipal, IdentityUtils utils, ApplicationDbContext db) =>
{
    var loggedInUser = await utils.GetUser(claimsPrincipal);
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
    var loggedInUser = await utils.GetUser(claimsPrincipal);
    var commonChatHistory = await db.Chats
        .Where(c => c.Members.Any(m => m.Id == id))
        .Where(c => c.Members.Contains(loggedInUser))
        .Include(c => c.History)
        .ThenInclude(h => h.Author)
        .SelectMany(c => c.History)
        .OrderBy(h => h.SentOn)
        //We are creating a dto to avoid cyclic references when serializing
        .Select(h => new
        {
            h.Id,
            h.Message,
            h.SentOn,
            author = new
            {
                id = h.Author.Id,
                h.Author.FirstName,
                h.Author.LastName,
            }
        })
        .ToListAsync();

    return commonChatHistory;
})
.RequireAuthorization();

app.Run();

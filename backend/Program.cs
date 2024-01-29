using System.Runtime.Versioning;
using System.Security.Claims;
using backend;
using backend.Entities;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
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

builder.Services.AddSignalR();

if (builder.Environment.IsDevelopment())
{
    builder.Services.AddDatabaseDeveloperPageExceptionFilter();
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();
}


var loggedInUserId = "177";

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

app.MapHub<ChatHub>("/chatHub");

app.MapGet("/whoami", (ClaimsPrincipal user, [FromServices] UserManager<ApplicationUser> userManager) =>
{
    return userManager.GetUserAsync(user);
})
.RequireAuthorization();

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

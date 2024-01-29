using System.Security.Claims;
using backend.DTOs;
using backend.Entities;
using backend.Hubs;
using backend.Utils;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

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
builder.Services.AddIdentityCore<ApplicationUser>();
builder.Services.AddScoped<SignInManager<ApplicationUser>>();

builder.Services.AddSignalR();
builder.Services.AddSingleton<UserIdToConnectionIds>();

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

app.MapPost("/logout", async ([FromServices] SignInManager<ApplicationUser> signInManager) =>
{
    await signInManager.SignOutAsync();
    return TypedResults.Ok();
})
.RequireAuthorization();

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
    .Include(chats => chats.Members)
    .Include(chats => chats.History)
    .Where(chats => chats.Members.Contains(loggedInUser))
    .OrderByDescending(chats => chats
        .History
        .OrderBy(h => h.SentOn)
        .Last())
    .Select(chat => chat.GetDto())
    .AsAsyncEnumerable();
})
.RequireAuthorization();

app.MapPost("/chats", async Task<Results<ProblemHttpResult, Ok<ChatRoomCreatedDto>>>
    ([FromBody] AddChatWithUserDto body, IHubContext<ChatHub> hubContext,
    UserIdToConnectionIds userIdToConnectionIds,
     ClaimsPrincipal claimsPrincipal, IdentityUtils utils, ApplicationDbContext db) =>
{

    var loggedInUserTask = utils.GetUserAsync(claimsPrincipal);

    //Can't do that because string.Equals would need to be evaluated on the client.
#pragma warning disable CA1862 // Use the 'StringComparison' method overloads to perform case-insensitive string comparisons
    var userToAddTask = db.Users.FirstOrDefaultAsync(user => user.NormalizedEmail == body.Email.ToUpper());
#pragma warning restore CA1862 // Use the 'StringComparison' method overloads to perform case-insensitive string comparisons

    await Task.WhenAll(loggedInUserTask, userToAddTask!);

    var loggedInUser = await loggedInUserTask;
    var userToAdd = await userToAddTask;

    if (userToAdd is null)
    {
        return HttpHelpers.ProduceBadRequestProblem($"No user with email \"{body.Email}\" found.");
    }
    if (loggedInUser.Id == userToAdd.Id)
    {
        return HttpHelpers.ProduceBadRequestProblem($"User {loggedInUser.Email} can't be in a room with himself.");
    }

    var haveCommonChats = await db.Chats
        .Where(chat => chat.Members.Any(member => member.Id == loggedInUser.Id))
        .Where(chat => chat.Members.Any(member => member.Id == userToAdd.Id))
        .AnyAsync();

    if (haveCommonChats)
    {
        return HttpHelpers.ProduceBadRequestProblem($"User {loggedInUser.Email} is already in a chat room with {userToAdd.Email}.");
    }

    var newChat = new Chats()
    {
        Members = [userToAdd, loggedInUser],
        History = null!
    };

    await db.Chats.AddAsync(newChat);
    await db.SaveChangesAsync();

    void addUserIdToSignalRGroup(string userId, string groupId)
    {
        if (userIdToConnectionIds.Dict.TryGetValue(userId, out var userConnections))
        {
            foreach (var connection in userConnections)
            {
                hubContext.Groups.AddToGroupAsync(connection, groupId);
            }
        }

    }

    //When clients connect they are added to groups based on the Chats they are in.
    //When a new Chat is added we need to add the user's connection(s) to the new Chats' group.
    addUserIdToSignalRGroup(loggedInUser.Id, newChat.Id.ToString());
    addUserIdToSignalRGroup(userToAdd.Id, newChat.Id.ToString());

    var resultDto = new ChatRoomCreatedDto(newChat.Id, newChat.Members.Select(member => member.GetDto()));

    return TypedResults.Ok(resultDto);
})
.RequireAuthorization();

app.MapGet("/chats/{chatId}", async Task<Results<NotFound, Ok<ChatRoomWithHistoryDto>>>
    (int chatId, ClaimsPrincipal claimsPrincipal, IdentityUtils utils, ApplicationDbContext db) =>
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
            history = chat.History.Select(h => h.GetDto())
        })
        .FirstOrDefaultAsync(c => c.id == chatId);

    if (chat is null)
    {
        return TypedResults.NotFound();
    }

    return TypedResults.Ok(new ChatRoomWithHistoryDto(chat.id, chat.members, chat.history));
})
.RequireAuthorization();

app.Run();

using System.Security.Claims;
using backend.Auth;
using backend.DTOs;
using backend.Entities;
using backend.Hubs;
using backend.Utils;
using Microsoft.AspNetCore.Authorization;
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
        if (builder.Environment.IsDevelopment())
        {
            configurePolicy.SetIsOriginAllowed(origin => true);
            configurePolicy.AllowCredentials();
            configurePolicy.AllowAnyHeader();
        }
    });
});

builder.Services.AddIdentityApiEndpoints<ApplicationUser>()
    .AddEntityFrameworkStores<ApplicationDbContext>();
builder.Services.AddScoped<IdentityUtils>();
builder.Services.AddScoped<SignInManager<ApplicationUser>>();
builder.Services.AddIdentityCore<ApplicationUser>();
builder.Services.AddTransient<IAuthorizationHandler, HasFinishedRegistrationHandler>();
builder.Services.AddAuthorizationBuilder()
    .AddPolicy("HasFinishedRegistrationAndLastName", policy => policy
        .RequireAuthenticatedUser()
        .AddRequirements(new HasFinishedRegistrationRequirement())
    );
builder.Services.Configure<IdentityOptions>(options =>
{
    options.User.RequireUniqueEmail = true;

    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequiredLength = 6;
    options.Password.RequiredUniqueChars = 1;
});

builder.Services.AddSignalR();
builder.Services.AddSingleton<UserIdToConnectionIds>();

if (builder.Environment.IsDevelopment())
{
    builder.Services.AddDatabaseDeveloperPageExceptionFilter();
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();
}

builder.Services.Configure<SeedDbOptions>(
    builder.Configuration.GetSection(SeedDbOptions.Position));
builder.Services.AddTransient<SeedDb>();

builder.Services.Configure<PeriodicActionOptions>(
    builder.Configuration.GetSection(PeriodicActionOptions.Position));
builder.Services.AddTransient<PeriodicActions>();

var app = builder.Build();


var scope = app.Services.CreateScope();
var shouldSeedDb = false;
using (scope)
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    shouldSeedDb = dbContext.Database.EnsureCreated();
}

var seedDb = app.Services.GetRequiredService<SeedDb>();
var periodicActions = app.Services.GetRequiredService<PeriodicActions>();
app.Lifetime.ApplicationStarted.Register(async () =>
{
    if (shouldSeedDb)
    {
        await seedDb.SeedWithDemoData();
    }
    _ = periodicActions.ClearNewDatabaseEntriesEveryHour();
});

app.UseCors();

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

app.MapIdentityApi<ApplicationUser>();

app.MapPost("/logout", async ([FromServices] SignInManager<ApplicationUser> signInManager) =>
{
    await signInManager.SignOutAsync();
    return TypedResults.Ok();
})
.RequireAuthorization();

app.MapPost("/complete-registration", async Task<Results<ProblemHttpResult, Ok>>
(ClaimsPrincipal claimsPrincipal, IdentityUtils utils, [FromBody] CompleteRegistrationDto completeRegistrationDto, ApplicationDbContext dbContext) =>
{
    var user = await utils.GetUserAsync(claimsPrincipal);
    var isFirstNameValid = !string.IsNullOrEmpty(completeRegistrationDto.FirstName) && completeRegistrationDto.FirstName.Length > 0;
    var isLastNameValid = !string.IsNullOrEmpty(completeRegistrationDto.LastName) && completeRegistrationDto.LastName.Length > 0;

    if (!isLastNameValid || !isFirstNameValid)
    {
        return HttpHelpers.ProduceBadRequestProblem(
            $"{nameof(CompleteRegistrationDto.FirstName)} and {nameof(CompleteRegistrationDto.LastName)} must be least one character long.");
    }

    user.FirstName = completeRegistrationDto.FirstName;
    user.LastName = completeRegistrationDto.LastName;

    dbContext.Update(user);
    await dbContext.SaveChangesAsync();

    return TypedResults.Ok();
}).RequireAuthorization();

app.MapHub<ChatHub>("/chatHub")
    .RequireAuthorization("HasFinishedRegistrationAndLastName");

app.MapGet("/whoami", async (ClaimsPrincipal claimsPrincipal, IdentityUtils utils) =>
{
    var loggedInUser = await utils.GetUserAsync(claimsPrincipal);
    return loggedInUser.GetDto();
})
.RequireAuthorization("HasFinishedRegistrationAndLastName");

app.MapGet("/chats", async (ClaimsPrincipal claimsPrincipal, IdentityUtils utils, ApplicationDbContext dbContext) =>
{
    var loggedInUser = await utils.GetUserAsync(claimsPrincipal);

    var orderedChats = dbContext.Chats
    //these includes are necessary for chat.lastmMessage.GetDto(), which requires Chat to not be null;
    .Include(chats => chats.History)
    .ThenInclude(history => history.Chats)
    .Where(chatsDto => chatsDto.Members.Contains(loggedInUser))
    .Select(chat => new
    {
        id = chat.Id,
        members = chat.Members,
        lastMessage = chat
            .History
            .OrderBy(history => history.SentOn)
            .Last()
    })
    .OrderByDescending(dto => dto.lastMessage.SentOn)
    .ToList();

    var dtos = orderedChats.Select(chat => new
    {
        chat.id,
        members = chat.members.Select(m => m.GetDto()),
        lastMessage = chat.lastMessage.GetDto()
    });

    //doing this on the db (for some reason) doesn't sort them properly.
    // var sortedDtos = dtos.OrderByDescending(dto => dto.lastMessage.SentOn);

    return dtos;
})
.RequireAuthorization("HasFinishedRegistrationAndLastName");

app.MapPost("/chats", async Task<Results<ProblemHttpResult, Ok<ChatRoomCreatedDto>>>
    ([FromBody] AddChatWithUserDto body, IHubContext<ChatHub, IChatClient> hubContext,
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

    var members = new List<ApplicationUser>(2) { userToAdd, loggedInUser };

    var newChat = new Chats()
    {
        Members = members,
        History = null!
    };

    await db.Chats.AddAsync(newChat);
    await db.SaveChangesAsync();

    await Task.WhenAll(
        userIdToConnectionIds.AddUserIdToSignalRGroup(loggedInUser.Id, newChat.Id.ToString()),
        userIdToConnectionIds.AddUserIdToSignalRGroup(userToAdd.Id, newChat.Id.ToString())
    );

    await hubContext.Clients.Group(newChat.Id.ToString()).AddChatRoom(newChat.Id, members.Select(m => m.GetDto()));

    var resultDto = new ChatRoomCreatedDto(newChat.Id, newChat.Members.Select(member => member.GetDto()));

    return TypedResults.Ok(resultDto);
})
.RequireAuthorization("HasFinishedRegistrationAndLastName");

app.MapGet("/chats/{chatId}", async Task<Results<NotFound, UnauthorizedHttpResult, Ok<ChatRoomWithHistoryDto>>>
    (int chatId, ClaimsPrincipal claimsPrincipal, IdentityUtils utils, ApplicationDbContext db) =>
{
    var loggedInUser = await utils.GetUserAsync(claimsPrincipal);
    if (!await utils.IsMemberOfChat(chatId, loggedInUser))
    {
        return TypedResults.Unauthorized();
    }

    var chat = await db.Chats
        .Include(chats => chats.History)
        .ThenInclude(history => history.Author)
        .ThenInclude(history => history.Chats)
        .Select(chat => new
        {
            id = chat.Id,
            members = chat.Members,
            history = chat.History
        })
        .FirstOrDefaultAsync(c => c.id == chatId);

    if (chat is null)
    {
        return TypedResults.NotFound();
    }

    var membersDtos = chat.members.Select(member => member.GetDto());
    var historyDtos = chat.history.Select(history => history.GetDto());

    return TypedResults.Ok(new ChatRoomWithHistoryDto(chat.id, membersDtos, historyDtos));
})
.RequireAuthorization("HasFinishedRegistrationAndLastName");

app.Run();

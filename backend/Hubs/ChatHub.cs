using backend.DTOs;
using backend.Entities;
using backend.Utils;
using CommunityToolkit.Diagnostics;
using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs;

public interface IChatClient
{
    Task ReceiveMessage(int chatsId, AuthorDto author, string message);
}

public class ChatHub(ILogger<ChatHub> logger,
    IdentityUtils identityUtils,
    ApplicationDbContext applicationDbContext,
    ApplicationDbContext dbContext) : Hub<IChatClient>
{
    private readonly IdentityUtils identityUtils = identityUtils;

    private readonly ApplicationDbContext applicationDbContext = applicationDbContext;

    private readonly ILogger<ChatHub> logger = logger;

    private readonly ApplicationDbContext dbContext = dbContext;

    private async Task<AuthorDto> GetAuthorDto()
    {
        Guard.IsNotNull(Context.User);
        var userEntity = await identityUtils.GetUserAsync(Context.User);

        return new(userEntity.Id, userEntity.FirstName, userEntity.LastName, userEntity.Email ?? "No valid email found");
    }

    private async Task<History> AddToHistory(string message, int chatRoomId)
    {
        Guard.IsNotNull(Context.User);

        var author = await identityUtils.GetUserAsync(Context.User);
        var chat = await applicationDbContext.Chats.FindAsync(chatRoomId);
        Guard.IsNotNull(chat);

        var newHistory = new History()
        {
            Author = author,
            Message = message,
            SentOn = DateTime.UtcNow,
            Chats = chat,
        };

        await applicationDbContext.History.AddAsync(newHistory);
        await applicationDbContext.SaveChangesAsync();

        return newHistory;
    }

    public async override Task OnConnectedAsync()
    {
        logger.LogInformation("User with id {username}, email {Email} and connection id {ConnectionId} connected",
            Context.UserIdentifier, Context.User?.Identity?.Name, Context.ConnectionId);

        Guard.IsNotNull(Context.User);
        var user = await identityUtils.GetUserAsync(Context.User);

        var chatsIds = dbContext
            .Chats
            .Where(c => c.Members.Any(m => m.Id == user.Id))
            .Select(c => c.Id)
            .ToList();

        await Task.WhenAll(chatsIds.Select(id => Groups.AddToGroupAsync(Context.ConnectionId, id.ToString())));

        await base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        logger.LogInformation("User with id {UserId}, email {Email} and connection id {ConnectionId} disconnected",
            Context.UserIdentifier, Context.User?.Identity?.Name, Context.ConnectionId);
        return base.OnDisconnectedAsync(exception);
    }

    public async Task SendMessage(string message, int chatsId)
    {
        Guard.IsNotNull(Context.User);
        var user = await identityUtils.GetUserAsync(Context.User);

        if (!await identityUtils.IsMemberOfChat(chatsId, user))
        {
            logger.LogInformation("User {user} tried to send message in chat with id {chatId} without being a member of that chat", user, chatsId);
            return;
        }

        await AddToHistory(message, chatsId);
        await Clients.Groups(chatsId.ToString()).ReceiveMessage(chatsId, await GetAuthorDto(), message);
    }
}

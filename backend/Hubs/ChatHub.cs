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

public class ChatHub(ILogger<ChatHub> logger, IdentityUtils identityUtils, ApplicationDbContext applicationDbContext) : Hub<IChatClient>
{
    private static readonly string DefaultGroupId = "1";

    private readonly IdentityUtils userManager = identityUtils;

    private readonly ApplicationDbContext applicationDbContext = applicationDbContext;

    private readonly ILogger<ChatHub> logger = logger;

    private async Task<AuthorDto> GetAuthorDto()
    {
        Guard.IsNotNull(Context.User);
        var userEntity = await userManager.GetUserAsync(Context.User);
        Guard.IsNotNull(userEntity);

        return new(userEntity.Id, userEntity.FirstName, userEntity.LastName, userEntity.Email ?? "No valid email found");
    }

    private async Task<History> AddToHistory(string message, int chatRoomId)
    {
        Guard.IsNotNull(Context.User);

        var author = await userManager.GetUserAsync(Context.User);
        var chat = await applicationDbContext.Chats.FindAsync(chatRoomId);
        Guard.IsNotNull(author);
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

    public override Task OnConnectedAsync()
    {
        logger.LogInformation("User with id {UserId}, email {Email} and connection id {ConnectionId} connected",
            Context.UserIdentifier, Context.User?.Identity?.Name, Context.ConnectionId);
        Groups.AddToGroupAsync(Context.ConnectionId, DefaultGroupId);
        return base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        logger.LogInformation("User with id {UserId}, email {Email} and connection id {ConnectionId} disconnected",
            Context.UserIdentifier, Context.User?.Identity?.Name, Context.ConnectionId);
        return base.OnDisconnectedAsync(exception);
    }

    public async Task SendMessage(string message, int chatsId)
    {
        await AddToHistory(message, chatsId);
        await Clients.Groups(DefaultGroupId).ReceiveMessage(chatsId, await GetAuthorDto(), message);
    }
}

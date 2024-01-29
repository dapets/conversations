using System.Collections.Concurrent;
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
    UserIdToConnectionIds userIdToConnectionIds,
    ApplicationDbContext dbContext) : Hub<IChatClient>
{
    private readonly UserIdToConnectionIds userIdToConnectionIds = userIdToConnectionIds;

    private readonly IdentityUtils identityUtils = identityUtils;

    private readonly ApplicationDbContext applicationDbContext = applicationDbContext;

    private readonly ILogger<ChatHub> logger = logger;

    private readonly ApplicationDbContext dbContext = dbContext;

    private async Task<AuthorDto> GetAuthorDto()
    {
        var userEntity = await identityUtils.GetUserAsync(Context.User);

        return new(userEntity.Id, userEntity.FirstName, userEntity.LastName, userEntity.Email ?? "No valid email found");
    }

    private async Task<History> AddToHistory(string message, int chatRoomId)
    {
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

    private void AddConnectionToDict(ApplicationUser user)
    {
        if (userIdToConnectionIds.Dict.TryGetValue(user.Id, out List<string>? value))
        {
            if (value is null) throw new InvalidOperationException($"Key {user.Id} in {nameof(userIdToConnectionIds)} was present but value was null.");

            value.Add(Context.ConnectionId);
            userIdToConnectionIds.Dict[user.Id] = value;
        }
        else
        {
            userIdToConnectionIds.Dict[user.Id] = [Context.ConnectionId];
        }
    }

    private void RemoveConnectionFromDict(ApplicationUser user)
    {
        if (userIdToConnectionIds.Dict.TryGetValue(user.Id, out List<string>? value))
        {
            if (value is null) throw new InvalidOperationException($"Key {user.Id} in {nameof(userIdToConnectionIds)} was present but value was null.");

            value.Remove(Context.ConnectionId);
            if (value.Count == 0)
            {
                userIdToConnectionIds.Dict.Remove(user.Id, out _);
            }
            else
            {
                userIdToConnectionIds.Dict[user.Id] = value;
            }
        }
        else
        {
            throw new InvalidOperationException($"Key {user.Id} in {nameof(userIdToConnectionIds)} was not present while disconnecting the connectionId {Context.ConnectionId}");
        }
    }

    public async override Task OnConnectedAsync()
    {
        logger.LogInformation("User with id {username}, email {Email} and connection id {ConnectionId} connected",
            Context.UserIdentifier, Context.User?.Identity?.Name, Context.ConnectionId);

        var user = await identityUtils.GetUserAsync(Context.User);

        var chatsIds = dbContext
            .Chats
            .Where(c => c.Members.Any(m => m.Id == user.Id))
            .Select(c => c.Id)
            .ToList();

        await Task.WhenAll(chatsIds.Select(id => Groups.AddToGroupAsync(Context.ConnectionId, id.ToString())));
        AddConnectionToDict(user);

        await base.OnConnectedAsync();
    }

    public async override Task OnDisconnectedAsync(Exception? exception)
    {
        logger.LogInformation("User with id {UserId}, email {Email} and connection id {ConnectionId} disconnected",
            Context.UserIdentifier, Context.User?.Identity?.Name, Context.ConnectionId);

        var user = await identityUtils.GetUserAsync(Context.User);
        RemoveConnectionFromDict(user);

        await base.OnDisconnectedAsync(exception);
    }

    public async Task SendMessage(string message, int chatsId)
    {
        Guard.IsNotNullOrEmpty(message);
        Guard.HasSizeLessThanOrEqualTo(message, Constants.MaxMessageLength);

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

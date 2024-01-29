using backend.DTOs;
using backend.Entities;
using backend.Utils;
using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs;

public interface IChatClient
{
    Task ReceiveMessage(AuthorDto author, string message);
}

public class ChatHub(UserManager<ApplicationUser> userManager) : Hub<IChatClient>
{
    private static readonly string DefaultGroupId = "1";

    private readonly UserManager<ApplicationUser> userManager = userManager;

    private async Task<AuthorDto> GetAuthorDto()
    {
        if (Context.User is null) throw new InvalidOperationException($"{nameof(Context.User)} is null");

        var userEntity = await userManager.GetUserAsync(Context.User) ?? throw new InvalidOperationException($"{nameof(Context.User)} is null");

        return new(userEntity.Id, userEntity.FirstName, userEntity.LastName, userEntity.Email ?? "No valid email found");
    }

    public override Task OnConnectedAsync()
    {
        Console.WriteLine($"{Context.ConnectionId} connected");
        Console.WriteLine($"User: {Context.User?.Identity?.Name}");
        Groups.AddToGroupAsync(Context.ConnectionId, DefaultGroupId);
        return base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        Console.WriteLine($"{Context.ConnectionId} disconnected");
        return base.OnDisconnectedAsync(exception);
    }

    public async Task SendMessage(string message)
    {
        await Clients.Groups(DefaultGroupId).ReceiveMessage(await GetAuthorDto(), message);
    }
}

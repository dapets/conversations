using backend.Entities;
using Microsoft.AspNetCore.SignalR;

namespace backend;

public interface IChatClient
{
    Task ReceiveMessage(string information);
}

public class ChatHub : Hub<IChatClient>
{

    private static readonly string DefaultGroupId = "1";

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
        await Clients.Groups(DefaultGroupId).ReceiveMessage(message);
    }
}

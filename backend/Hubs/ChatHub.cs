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
        Groups.AddToGroupAsync(Context.ConnectionId, DefaultGroupId);
        return base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        Console.WriteLine($"{Context.ConnectionId} disconnected");
        return base.OnDisconnectedAsync(exception);
    }

    public async Task SendMessage(string information)
    {
        await Clients.Groups(DefaultGroupId).ReceiveMessage(information);
    }
}

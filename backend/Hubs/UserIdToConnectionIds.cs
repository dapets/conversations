using System.Collections.Concurrent;
using backend.Entities;
using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs;

/// <summary>
/// When clients connect, they are added to signalR groups based on the Chats they are in. <br />
/// When a new Chat is added, we need to add the user's connection(s) to the new Chats' signalR group. <br />
/// This class provides functionality to make it easier to handle these groups and connections.
/// </summary>
/// <param name="hubContext"></param>
public class UserIdToConnectionIds(IHubContext<ChatHub> hubContext)
{
  private readonly IHubContext<ChatHub> hubContext = hubContext;

  private ConcurrentDictionary<string, List<string>> Dict { get; set; } = new();

  public void AddConnectionToDict(ApplicationUser user, string connectionId)
  {
    if (Dict.TryGetValue(user.Id, out List<string>? value))
    {
      if (value is null) throw new InvalidOperationException($"Key {user.Id} in {nameof(Dict)} was present but value was null.");

      value.Add(connectionId);
      Dict[user.Id] = value;
    }
    else
    {
      Dict[user.Id] = [connectionId];
    }
  }

  public void RemoveConnectionFromDict(ApplicationUser user, string connectionId)
  {
    if (Dict.TryGetValue(user.Id, out List<string>? value))
    {
      if (value is null) throw new ArgumentException($"Key {user.Id} in {nameof(Dict)} was present but value was null.");

      value.Remove(connectionId);
      if (value.Count == 0)
      {
        Dict.Remove(user.Id, out _);
      }
      else
      {
        Dict[user.Id] = value;
      }
    }
    else
    {
      throw new ArgumentException($"Key {user.Id} in {nameof(Dict)} was not present while disconnecting the connectionId {connectionId}");
    }
  }

  public async Task AddUserIdToSignalRGroup(string userId, string groupId)
  {
    if (Dict.TryGetValue(userId, out var userConnections))
    {
      var addUsersTasks = new List<Task>(userConnections.Count);
      foreach (var connection in userConnections)
      {
        addUsersTasks.Add(hubContext.Groups.AddToGroupAsync(connection, groupId));
      }

      await Task.WhenAll(addUsersTasks);
    }

  }
}

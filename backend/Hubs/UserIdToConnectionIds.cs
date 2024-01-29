using System.Collections.Concurrent;

namespace backend.Hubs;

public class UserIdToConnectionIds
{
  public ConcurrentDictionary<string, List<string>> Dict { get; set; } = new();
}

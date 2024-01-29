using backend.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace backend.Utils;

public class PeriodicActionOptions
{
  public static readonly string Position = "PeriodicActions";

  public required string IS_TEST_INSTANCE { get; set; }

  public bool IsTestInstance => IS_TEST_INSTANCE == "True";
}

public class PeriodicActions(ILogger<PeriodicActions> logger, ApplicationDbContext dbContext, IOptionsMonitor<PeriodicActionOptions> optionsMonitor)
{
  private readonly ILogger<PeriodicActions> logger = logger;

  private readonly ApplicationDbContext dbContext = dbContext;

  private readonly IOptionsMonitor<PeriodicActionOptions> optionsMonitor = optionsMonitor;

  public async Task ClearNewDatabaseEntriesEveryHour()
  {
    var applicationStart = DateTime.UtcNow;
    var seededUsers = await dbContext.Users.Select(u => u.Id).ToListAsync();

    var timer = new PeriodicTimer(TimeSpan.FromHours(1));

    await Task.Run(async () =>
    {
      while (await timer.WaitForNextTickAsync())
      {
        if (!optionsMonitor.CurrentValue.IsTestInstance) continue;
        logger.LogInformation("Running {function}...", nameof(ClearNewDatabaseEntriesEveryHour));

        await Task.WhenAll(
        dbContext.Users
          .Where(users => !seededUsers.Contains(users.Id))
          .ExecuteDeleteAsync(),
        dbContext.History
          .Where(history => applicationStart < history.SentOn)
          .ExecuteDeleteAsync());
      }
    });
  }
}

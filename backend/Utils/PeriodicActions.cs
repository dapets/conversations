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

/// <summary>
/// This isn't a BackgroundService because we want to run this after SeedDb. <br />
/// Just making it a regular class and running it after await'ing SeedDb.SeedWithDemoData()
/// seemed like the simplest way of doing it.
/// </summary>
public class PeriodicActions(ILogger<PeriodicActions> logger, IServiceProvider services, IOptionsMonitor<PeriodicActionOptions> optionsMonitor)
{
  private readonly ILogger<PeriodicActions> logger = logger;

  private readonly IServiceProvider services = services;

  private readonly IOptionsMonitor<PeriodicActionOptions> optionsMonitor = optionsMonitor;

  public async Task ClearNewDatabaseEntriesEveryHour()
  {
    var applicationStart = DateTime.UtcNow;
    var timer = new PeriodicTimer(TimeSpan.FromSeconds(15));

    using var scope = services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

    var seededUsers = await dbContext.Users.Select(u => u.Id).ToListAsync();
    var seededChats = await dbContext.Chats.Select(u => u.Id).ToListAsync();

    await Task.Run(async () =>
    {
      while (await timer.WaitForNextTickAsync())
      {
        if (!optionsMonitor.CurrentValue.IsTestInstance) continue;
        logger.LogInformation("Running {function}...", nameof(ClearNewDatabaseEntriesEveryHour));

        await Task.WhenAll(
          dbContext.History
            .Where(history => applicationStart < history.SentOn)
            .ExecuteDeleteAsync(),
          dbContext.Chats
            .Where(chats => !seededChats.Contains(chats.Id))
            .ExecuteDeleteAsync(),
          dbContext.Users
            .Where(users => !seededUsers.Contains(users.Id))
            .ExecuteDeleteAsync()
        );
      }
    });
  }
}

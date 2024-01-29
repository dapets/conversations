using backend.DTOs;
using backend.Entities;
using Bogus;

namespace backend.Utils;

public class SeedDbOptions()
{
    public const string Position = "SeedDbOptions";

    public required string DemoUserEmail { get; set; }

    public required string DemoUserPassword { get; set; }
}

public class SeedDb
{
    record LoginResponses(string AccessToken);

    record RegisterDto(string Email, string Password);

    private static string BuildEmail(ApplicationUser user) => $"{user.FirstName}@{user.LastName}.com";

    private static readonly string Password = "123456";

    private static readonly HttpClient HttpClient = new()
    {
        BaseAddress = new Uri("http://localhost:3001")
    };

    private static async Task<HttpResponseMessage> LogInAndInvoke(RegisterDto loginData, string url, object? content, HttpMethod method)
    {
        var loginResponse = await HttpClient.PostAsJsonAsync("/login", loginData);
        var parsedLogin = await loginResponse.Content.ReadFromJsonAsync<LoginResponses>();
        if (parsedLogin is null)
        {
            throw new InvalidOperationException($"${nameof(parsedLogin)} was null");
        }

        var postRequest = new HttpRequestMessage()
        {
            RequestUri = new Uri(url, UriKind.Relative),
            Content = JsonContent.Create(content),
            Method = method
        };
        postRequest.Headers.Authorization = new("Bearer", parsedLogin.AccessToken);

        return await HttpClient.SendAsync(postRequest);
    }

    private static async Task<ApplicationUserDto> RegisterUser(ApplicationUser newUserData, RegisterDto registerDto)
    {
        await HttpClient.PostAsJsonAsync("/register", registerDto);

        var completeRegistrationDto = new CompleteRegistrationDto(newUserData.FirstName, newUserData.LastName);
        await LogInAndInvoke(registerDto, "/complete-registration", completeRegistrationDto, HttpMethod.Post);

        var applicationUserResponse = await LogInAndInvoke(registerDto, "/whoami", null, HttpMethod.Get);
        var applicationUserDto = await applicationUserResponse.Content.ReadFromJsonAsync<ApplicationUserDto>();
        if (applicationUserDto is null)
        {
            throw new InvalidOperationException($"{nameof(applicationUserDto)} is null");
        }

        return applicationUserDto;
    }

    public static async Task<IEnumerable<ApplicationUserDto>> GenerateAndRegisterMockUsers(string demoUserEmail, string demoUserPassword)
    {

        var userFaker = new Faker<ApplicationUser>()
          .RuleFor(p => p.FirstName, f => f.Name.FirstName())
          .RuleFor(p => p.LastName, f => f.Name.LastName())
          .RuleFor(p => p.Email, (f, u) => BuildEmail(u));

        var addUsersTasks = new List<Task<ApplicationUserDto>>();

        for (int i = 0; i < 15; i++)
        {

            ApplicationUser newUserData;
            RegisterDto registerDto;
            if (i == 0)
            {
                newUserData = new ApplicationUser()
                {
                    FirstName = "Demo",
                    LastName = "User",
                    Email = demoUserEmail,
                };
                registerDto = new(demoUserEmail, demoUserPassword);
            }
            else
            {
                newUserData = userFaker.Generate();
                registerDto = new(newUserData.Email!, Password);
            }
            addUsersTasks.Add(RegisterUser(newUserData, registerDto));
        }

        await Task.WhenAll(addUsersTasks);
        return addUsersTasks.Select(task => task.Result);
    }

    private static async Task GenerateMockChatMessages(IEnumerable<ApplicationUserDto> users, ApplicationDbContext dbContext)
    {

        var rnd = new Random();
        var faker = new Faker();

        var mainUser = users.First();
        var mainAppUser = new ApplicationUser()
        {
            Id = mainUser.Id
        };

        var otherUsers = users.Skip(1);
        foreach (var user in otherUsers)
        {
            var appUser = new ApplicationUser()
            {
                Id = user.Id
            };
            var members = new List<ApplicationUser>() { appUser, mainAppUser };

            var newChat = new Chats()
            {
                Members = members,
                History = null!
            };

            await dbContext.Chats.AddAsync(newChat);
            await dbContext.SaveChangesAsync();
            dbContext.History.Add(new()
            {
                Author = rnd.NextSingle() > 0.5 ? appUser : mainAppUser,
                Chats = newChat,
                SentOn = DateTime.UtcNow.AddHours(rnd.Next(1, 15)),
                Message = faker.Lorem.Sentences(rnd.Next(1, 3))
            });
        }
    }

    public static async Task SeedWithDemoData(string demoUserEmail, string demoUserPassword, ApplicationDbContext dbContext)
    {
        var users = await GenerateAndRegisterMockUsers(demoUserEmail, demoUserPassword);

        await GenerateMockChatMessages(users, dbContext);
    }
}

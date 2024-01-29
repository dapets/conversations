using backend.DTOs;
using backend.Entities;
using Bogus;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace backend.Utils;

public class SeedDbOptions()
{
    public const string Position = "SeedDbOptions";

    public required string Demo_User_Email { get; set; }

    public required string Demo_User_Password { get; set; }
}

public class SeedDb(IOptions<SeedDbOptions> seedOptions, ApplicationDbContext dbContext)
{
    record LoginResponses(string AccessToken);

    record RegisterDto(string Email, string Password);

    private readonly IOptions<SeedDbOptions> seedOptions = seedOptions;

    private readonly ApplicationDbContext dbContext = dbContext;

    private readonly string password = "123456";

    private readonly HttpClient HttpClient = new()
    {
        //Not hardcoding the port is kind of annoying because we'd need to use app.Start() 
        //and some other things, this will do for now.
        BaseAddress = new Uri("http://localhost:3001")
    };

    private static string BuildEmail(ApplicationUser user) => $"{user.FirstName}@{user.LastName}.com";

    private async Task<HttpResponseMessage> LogInAndInvoke(RegisterDto loginData, string url, object? content, HttpMethod method)
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

        var response = await HttpClient.SendAsync(postRequest);

        return response;
    }

    private async Task<ApplicationUserDto> RegisterUser(ApplicationUser newUserData, RegisterDto registerDto)
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

    private async Task<IEnumerable<ApplicationUserDto>> GenerateAndRegisterMockUsers(string demoUserEmail, string demoUserPassword)
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
                registerDto = new(newUserData.Email!, password);
            }
            addUsersTasks.Add(RegisterUser(newUserData, registerDto));
        }

        await Task.WhenAll(addUsersTasks);
        return addUsersTasks.Select(task => task.Result);
    }

    private static async Task GenerateMockChat(string userId, ApplicationUser mainUser, ApplicationDbContext dbContext)
    {
        var rnd = new Random();
        var faker = new Faker();

        var user = await dbContext.Users.FirstAsync(user => user.Id == userId);

        var members = new List<ApplicationUser>() { user, mainUser };

        var newChat = new Chats()
        {
            Members = members,
        };

        await dbContext.Chats.AddAsync(newChat);
        await dbContext.SaveChangesAsync();

        var conversationStart = DateTime.UtcNow.AddHours(-rnd.Next(5, 15));
        for (int i = 0; i < 15; i++)
        {

            dbContext.History.Add(new()
            {
                Author = rnd.NextSingle() > 0.5 ? user : mainUser,
                Chats = newChat,
                SentOn = conversationStart.AddMinutes(10 * i),
                Message = faker.Lorem.Sentences(rnd.Next(1, 3))
            });
        }
        await dbContext.SaveChangesAsync();
    }

    private async Task GenerateMockChatsForUsers(IEnumerable<ApplicationUserDto> users, ApplicationDbContext dbContext)
    {

        var mainUser = users.First();
        var mainAppUser = await dbContext.Users.FirstAsync(user => user.Id == mainUser.Id);

        var otherUsers = users.Skip(1);
        var addChatRoomsTaskList = new List<Task>(otherUsers.Count());
        foreach (var user in otherUsers)
        {
            addChatRoomsTaskList.Add(GenerateMockChat(user.Id, mainAppUser, dbContext));
        }

        await Task.WhenAll(addChatRoomsTaskList);
    }

    public async Task SeedWithDemoData()
    {
        var demoUserEmail = seedOptions.Value.Demo_User_Email;
        var demoUserPassword = seedOptions.Value.Demo_User_Password;

        var users = await GenerateAndRegisterMockUsers(demoUserEmail, demoUserPassword);

        await GenerateMockChatsForUsers(users, dbContext);
    }
}

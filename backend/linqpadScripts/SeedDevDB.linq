<Query Kind="Program">
  <Connection>
    <ID>3f392c14-cc24-4e56-a467-a1d88be0f49a</ID>
    <NamingServiceVersion>2</NamingServiceVersion>
    <Persist>true</Persist>
    <Driver Assembly="(internal)" PublicKeyToken="no-strong-name">LINQPad.Drivers.EFCore.DynamicDriver</Driver>
    <AttachFileName>\Users\dave\code\video\backend\prod.db</AttachFileName>
    <AllowDateOnlyTimeOnly>true</AllowDateOnlyTimeOnly>
    <DriverData>
      <EFProvider>Microsoft.EntityFrameworkCore.Sqlite</EFProvider>
      <EncryptSqlTraffic>True</EncryptSqlTraffic>
      <PreserveNumeric1>True</PreserveNumeric1>
    </DriverData>
  </Connection>
  <NuGetReference>Bogus</NuGetReference>
  <Namespace>Bogus</Namespace>
  <Namespace>System.Net.Http</Namespace>
  <Namespace>System.Net.Http.Json</Namespace>
</Query>

async void Main()
{
	var faker = new Faker();
	var httpClient = new HttpClient();
	httpClient.BaseAddress = new Uri("http://localhost:3001");

	var userFaker = new Faker<AspNetUsers>()
		.RuleFor(p => p.FirstName, f => f.Name.FirstName())
		.RuleFor(p => p.LastName, f => f.Name.LastName());

	var rnd = new Random();

	for (int i = 0; i < 15; i++)
	{
		var newUserData = userFaker.Generate();
		var registerData = new RegisterRequest(BuildEmail(newUserData), Pw);

		await httpClient.PostAsJsonAsync("/register", registerData);
		var loginResponse = await httpClient.PostAsJsonAsync("/login", registerData);
		var parsedLogin = await loginResponse.Content.ReadFromJsonAsync<LoginResponses>();
		httpClient.DefaultRequestHeaders.Authorization = new("Bearer", parsedLogin.AccessToken);
		var completeRegistrationRequest = new CompleteRegistrationRequest(newUserData.FirstName, newUserData.LastName);
		await httpClient.PostAsJsonAsync("/complete-registration", completeRegistrationRequest);
		var userResponse = await httpClient.GetFromJsonAsync<SmallUser>("/whoami");
	}

	SubmitChanges();
	var mainUser = AspNetUsers.First();
	var otherUsers = AspNetUsers.Skip(1);

	foreach (var user in otherUsers)
	{
		if(user.Id == mainUser.Id) continue;
		
		var chat = new Chats();
		Chats.Add(chat);
		SubmitChanges();

		var first = new ApplicationUserChats()
		{
			Chats = chat,
			Members = user,
		};
		var second = new ApplicationUserChats()
		{
			Chats = chat,
			Members = mainUser,
		};
		ApplicationUserChats.Add(first);
		ApplicationUserChats.Add(second);

		for (int i = 0; i < 15; i++)
		{
			Histories.Add(new()
			{
				Author = rnd.NextSingle() > 0.5 ? user : mainUser,
				Chats = chat,
				SentOn = DateTimeOffset.UtcNow.AddHours(rnd.Next(1, 15)).ToString("o"),
				Message = faker.Lorem.Sentences(rnd.Next(1, 3))
			});
		}

		SubmitChanges();
	}
	
	"Done".Dump();

}
string Pw = "123456";
string BuildEmail(AspNetUsers user) => $"{user.FirstName}@{user.LastName}.com";

record RegisterRequest(string Email, string Password);
record CompleteRegistrationRequest(string FirstName, string LastName);
record LoginResponses(string AccessToken);
record SmallUser(string Id);
// You can define other methods, fields, classes and namespaces here

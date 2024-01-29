<Query Kind="Program">
  <Connection>
    <ID>363b3232-5867-446d-874d-ca41c536f665</ID>
    <NamingServiceVersion>2</NamingServiceVersion>
    <Persist>true</Persist>
    <Driver Assembly="(internal)" PublicKeyToken="no-strong-name">LINQPad.Drivers.EFCore.DynamicDriver</Driver>
    <AttachFileName>C:\Users\dave\code\video\backend\dev.db</AttachFileName>
    <DisplayName>videoDevDB</DisplayName>
    <DriverData>
      <EncryptSqlTraffic>True</EncryptSqlTraffic>
      <PreserveNumeric1>True</PreserveNumeric1>
      <EFProvider>Microsoft.EntityFrameworkCore.Sqlite</EFProvider>
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
		var userResponse = await httpClient.GetFromJsonAsync<SmallUser>("/whoami");
		
		var user = AspNetUsers.First(u => u.Id == userResponse.Id);
		user.FirstName = newUserData.FirstName;
		user.LastName = newUserData.LastName;
		AspNetUsers.Update(user);
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
string Pw = "Password0$";
string BuildEmail(AspNetUsers user) => $"{user.FirstName}@{user.LastName}.com";

record RegisterRequest(string Email, string Password);
record LoginResponses(string AccessToken);
record SmallUser(string Id);
// You can define other methods, fields, classes and namespaces here

<Query Kind="Statements">
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
</Query>

var faker = new Faker();

var userFaker = new Faker<Users>()
	.RuleFor(p => p.FirstName, f => f.Name.FirstName())
	.RuleFor(p => p.LastName, f => f.Name.LastName());
	
var rnd = new Random();

var mainUser = userFaker.Generate();
Users.Add(mainUser);

var otherUsers = new List<Users>();

for (int i = 0; i < 15; i++)
{
	var newUser = userFaker.Generate();
	otherUsers.Add(newUser);
	Users.Add(newUser);
}

SubmitChanges();

foreach (var user in otherUsers)
{
	var chat = new Chats();
	Chats.Add(chat);
	SubmitChanges();
	
	var first = new ChatsUser()
	{
		Chats = chat,
		Members = user,
	};
	var second = new ChatsUser()
	{
		Chats = chat,
		Members = mainUser,
	};
	ChatsUsers.Add(first);
	ChatsUsers.Add(second);
	
	for (int i = 0; i < 15; i++)
	{
		Histories.Add(new() {
			Author = rnd.NextSingle() > 0.5 ? user : mainUser,
			Chats = chat,
			SentOn = DateTimeOffset.UtcNow.AddHours(rnd.Next(1, 15)).ToString("o"),
			Message = faker.Lorem.Sentences(rnd.Next(1,3))
		});
	}
	
	SubmitChanges();
}

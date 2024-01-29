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
  <NuGetReference>Microsoft.AspNetCore.SignalR.Client</NuGetReference>
  <Namespace>LINQPad.Controls</Namespace>
  <Namespace>Microsoft.AspNetCore.SignalR</Namespace>
  <Namespace>Microsoft.AspNetCore.SignalR.Client</Namespace>
  <Namespace>System.Drawing</Namespace>
  <Namespace>System.Threading.Tasks</Namespace>
  <Namespace>System.Net.Http</Namespace>
  <Namespace>System.Net.Http.Json</Namespace>
  <Namespace>System.Net</Namespace>
</Query>

record LoginRequest(string Email, string Password);
record TokenResponse(string TokenType, string AccessToken);
static int messagesSent = 0;
async Task Main()
{
	//var mainUserEmail = AspNetUsers.First().Email;
	//use second user
	var mainUserEmail = AspNetUsers.Skip(1).First().Email;
	var password = "Password0$";

	var httpClient = new HttpClient();
	var result = await httpClient.PostAsJsonAsync("http://localhost:3001/login", new LoginRequest(mainUserEmail, password));
	var loginResult = await result.Content.ReadFromJsonAsync<TokenResponse>();

	var connection = new HubConnectionBuilder()
				  .WithUrl("http://localhost:3001/chatHub", config =>
				  {
					  config.AccessTokenProvider = () => Task.FromResult(loginResult.AccessToken);
				  })
				  .WithAutomaticReconnect()
				  .Build();

	await connection.StartAsync();

	var tb = new TextBox(messagesSent.ToString()).Dump("Message");
	var chatsId = new TextBox("18").Dump("ChatsId");

	new Button("Send message", async (_) => await connection.SendAsync("SendMessage", tb.Text, int.Parse(chatsId.Text)))
	.Dump();

	connection.On("ReceiveMessage", (int chatRoom, AuthorDto author, string information) =>
	{
		messagesSent++;
		tb.Text = "Message" + messagesSent;
		chatRoom.Dump();
		author.Dump();
		information.Dump();
	});
}

record AuthorDto(string Email);

// You can define other methods, fields, classes and namespaces here

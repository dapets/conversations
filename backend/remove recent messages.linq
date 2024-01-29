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
  <Namespace>LINQPad.Controls</Namespace>
</Query>

void Main()
{
	Util.HorizontalRun(true,
	new Button("Remove entries", onClick: ((_) =>
	{
		trackRecents();
		SubmitChanges();
		trackRecents();
	})),
	new Button("Refresh", onClick: (_ => trackRecents()))
	).Dump();
	removeMeContainer.Dump("Recent messages");
	trackRecents();
}
public DumpContainer removeMeContainer = new DumpContainer();
void trackRecents()
{
	var isRecentEnough = (History history) => (DateTime.Now - DateTime.Parse(history.SentOn)).Days < 5;
	var removeMe = Histories.AsEnumerable().Where(h => isRecentEnough(h));
	removeMeContainer.Content = removeMe;
	Histories.RemoveRange(removeMe);
}


// You can define other methods, fields, classes and namespaces here

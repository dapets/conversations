<Query Kind="SQL">
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
</Query>

CREATE TABLE IF NOT EXISTS ChatRooms (
	Id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	FirstUser INTEGER NOT NULL,
	SecondUser INTEGER NOT NULL,
	FOREIGN KEY (FirstUser) REFERENCES Users(Id),
	FOREIGN KEY (SecondUser) REFERENCES Users(Id)
);

DELETE FROM ChatRooms;
DELETE FROM Users;

--CREATE TABLE IF NOT EXISTS ChatRoomParticipants (
--	Id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
--	UserId INTEGER NOT NULL,
--	ChatRoomId INTEGER NOT NULL,
--	FOREIGN KEY (UserId) REFERENCES Users(Id),
--	FOREIGN KEY (ChatRoomId) REFERENCES ChatRooms(Id)
--);
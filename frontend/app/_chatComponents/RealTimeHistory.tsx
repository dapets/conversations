"use client";

import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import React from "react";

function App() {
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("Your_SignalR_Endpoint")
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then((result) => {
          console.log("Connected!");

          connection.on("ReceiveMessage", (message) => {
            console.log("Received message: ", message);
          });
        })
        .catch((e) => console.log("Connection failed: ", e));
    }
  }, [connection]);

  // Your component return
  return <div className="App">{/* Your component layout */}</div>;
}

export default App;

export function RealtimeHistory() {
  const [realtimeHistory, setRealtimeHistory] = React.useState<string[]>([]);
  const [connection, setConnection] = React.useState<HubConnection | null>(
    null
  );

  React.useEffect(() => {
    let connection = new HubConnectionBuilder()
      .withUrl("http://localhost:3001" + "/chatHub")
      .withAutomaticReconnect()
      .build();

    setConnection(connection);
  }, []);

  React.useEffect(() => {
    if (!connection) {
      return;
    }
    connection.start().then(() => {
      connection.on("ReceiveMessage", (message) => console.log(message));
    });
  }, [connection]);

  return null;
}

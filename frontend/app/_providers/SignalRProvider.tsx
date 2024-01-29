"use client";

import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { createContext, useEffect, useState } from "react";

export const SignalRConnectionContext = createContext<HubConnection | null>(
  null
);

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [connection, setConnection] = useState<HubConnection | null>(null);

  useEffect(() => {
    let localConn = new HubConnectionBuilder()
      .withUrl("http://localhost:3001" + "/chatHub")
      .withAutomaticReconnect()
      .build();
    localConn
      .start()
      .catch((reason: Error) => {
        //this happens in dev mode because effects are executed twice
        if (reason instanceof Error) {
          console.info(
            "Connection was aborted while still trying to connect to the server." +
              "This usually happens in development mode."
          );
        } else {
          console.error(reason);
        }
      })
      .then(() => setConnection(localConn));

    return () => {
      localConn.stop();
    };
  }, [setConnection]);

  return (
    <SignalRConnectionContext.Provider value={connection}>
      {children}
    </SignalRConnectionContext.Provider>
  );
}

"use client";

import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { createContext, useEffect, useState } from "react";
import { UserEntity } from "utils/dbEntities";

type HubMethodNames = {
  ReceiveMessage: (
    chatRoomId: number,
    author: UserEntity,
    message: string
  ) => void;
};

type ChatClientHubConnection = Omit<HubConnection, "on"> & {
  on<T extends keyof HubMethodNames>(
    methodName: T,
    newMethod: HubMethodNames[T]
  ): void;
};

export const SignalRConnectionContext =
  createContext<ChatClientHubConnection | null>(null);

export default function SignalRProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [connection, setConnection] = useState<ChatClientHubConnection | null>(
    null
  );
  const [oldCookie, setOldCookie] = useState("");

  useEffect(() => {
    const restartConnOnCookieChange = setInterval(() => {
      if (document.cookie === oldCookie) return;
      else {
        setOldCookie(document.cookie);
        connection?.stop().then(() => connection.start());
      }
    }, 500);
    return () => clearInterval(restartConnOnCookieChange);
  }, [connection, oldCookie, setOldCookie]);

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

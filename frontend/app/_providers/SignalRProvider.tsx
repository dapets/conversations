"use client";

import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from "@microsoft/signalr";
import { useSearchParams } from "next/navigation";
import { createContext, useEffect, useState } from "react";
import { hasLoginChangedQueryParam } from "utils/constants";
import { UserEntity } from "utils/dbEntities";

type HubMethodNames = {
  ReceiveMessage: (
    chatRoomId: number,
    author: UserEntity,
    message: string
  ) => void;
};

type ClientMethodNames = {
  send: (
    methodName: "SendMessage",
    message: string,
    chatRoomId: number
  ) => Promise<void> | void;
  invoke: (
    methodName: "SendMessage",
    message: string,
    chatRoomId: number
  ) => Promise<void> | void;
};

type ChatClientHubConnection = Omit<HubConnection, "on" | "send" | "invoke"> & {
  on<T extends keyof HubMethodNames>(
    methodName: T,
    newMethod: HubMethodNames[T]
  ): void;
} & ClientMethodNames;

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
  const params = useSearchParams();
  const shouldRestartSignalR = params.get(hasLoginChangedQueryParam) === "true";
  if (shouldRestartSignalR) {
    restartSignalR();
  }

  async function restartSignalR() {
    switch (connection?.state) {
      case HubConnectionState.Connected:
        await connection.stop();
        await connection.start();
        break;
      case HubConnectionState.Disconnected:
        await connection.start();
        break;
    }
  }

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
            "Connection was aborted while trying to connect to the server." +
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

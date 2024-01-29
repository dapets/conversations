"use client";

import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";
import { useSearchParams } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { hasLoginChangedQueryParam } from "utils/constants";
import { UserEntity } from "utils/projectTypes";

type HubMethodNames = {
  ReceiveMessage: (
    chatRoomId: number,
    author: UserEntity,
    message: string,
  ) => void;
  AddChatRoom: (chatRoomId: number, members: UserEntity[]) => void;
};

type ClientMethodNames = {
  send: (
    methodName: "SendMessage",
    message: string,
    chatRoomId: number,
  ) => Promise<void> | void;
  invoke: (
    methodName: "SendMessage",
    message: string,
    chatRoomId: number,
  ) => Promise<void> | void;
};

type ChatClientHubConnection = Omit<HubConnection, "on" | "send" | "invoke"> & {
  on<T extends keyof HubMethodNames>(
    methodName: T,
    newMethod: HubMethodNames[T],
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
    null,
  );
  const params = useSearchParams();
  /**
   * This is how the signalR connection is restarted on login/logout.
   * I couldn't really find a better way to tell signalR that the cookies changed.
   * This means that every time the `hasLoginChangedQueryParam` is set to true we restart the connection.
   */
  const haveCookiesChanged = params.get(hasLoginChangedQueryParam) === "true";
  if (haveCookiesChanged) {
    handleCookieChange();
  }

  async function handleCookieChange() {
    //if there's no cookie we just logged out and anything other than stopping makes no sense.
    if (!document.cookie) {
      const alreadyDisconnected =
        connection?.state !== HubConnectionState.Disconnected &&
        connection?.state !== HubConnectionState.Disconnecting;
      if (!alreadyDisconnected) {
        connection?.stop();
      }

      return;
    }

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
    if (!document.cookie) return;

    let localConn = new HubConnectionBuilder()
      .withUrl(process.env.NEXT_PUBLIC_SIGNALR_CONNECTION_URL + "/chatHub")
      .withAutomaticReconnect()
      .configureLogging(
        process.env.NEXT_PUBLIC_ENV === "production"
          ? LogLevel.Warning
          : LogLevel.Debug,
      )
      .build();
    localConn
      .start()
      .catch((reason: Error) => {
        //this happens in dev mode because effects are executed twice
        if (reason instanceof Error) {
          console.info(
            "Connection was aborted while trying to connect to the server." +
              "This usually happens in development mode.",
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

export function useSignalR() {
  const signalRConnectionContext = useContext(SignalRConnectionContext);
  //we can't throw an error here to guarantee non-null because the context isn't instantly available due to server-rendering.

  return signalRConnectionContext;
}

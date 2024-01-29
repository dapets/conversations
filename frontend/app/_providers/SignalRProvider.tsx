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
    //don't run this function on the server
    if (typeof window !== "object") return;

    //if there's no cookie we just logged out and anything other than stopping makes no sense.
    if (!document.cookie) {
      const alreadyDisconnected =
        connection?.state === HubConnectionState.Disconnected ||
        connection?.state === HubConnectionState.Disconnecting;
      if (!alreadyDisconnected) {
        await connection?.stop();
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
    let localConn = new HubConnectionBuilder()
      .withUrl(process.env.NEXT_PUBLIC_SIGNALR_CONNECTION_URL + "/chatHub")
      .withAutomaticReconnect()
      .configureLogging(
        process.env.NEXT_PUBLIC_ENV === "production"
          ? LogLevel.Warning
          : LogLevel.Information,
      )
      .build();

    /**In dev mode effects are fired twice.
     * If we stop the connection while it's currently disconnecting, signalR throws an error.
     */
    let startPromise: Promise<unknown> | null = null;
    //if there's no cookie we can't connect, so we only set the connection (without starting it)
    if (document.cookie) {
      startPromise = localConn.start();
      startPromise.then(() => setConnection(localConn));
    } else {
      setConnection(localConn);
    }

    return () => {
      startPromise?.then(() => {
        localConn.stop();
      });
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

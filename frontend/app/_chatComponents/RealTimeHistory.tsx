"use client";
import { useContext, useEffect, useState } from "react";
import { Message } from "./Message";
import { HistoryEntity } from "utils/types/dbEntities";
import { SignalRConnectionContext } from "./SignalRProvider";

export function RealtimeHistory({
  loggedInUserId,
  onNewChatMessageRendered: onNewMessage,
}: {
  loggedInUserId: number;
  onNewChatMessageRendered?: () => {};
}) {
  const connection = useContext(SignalRConnectionContext);
  const [realtimeHistory, setRealtimeHistory] = useState<HistoryEntity[]>([]);

  function receiveMessageHandler(information: string) {
    setRealtimeHistory((history) => [
      ...history,
      {
        author: {
          firstName: "Sophie",
          lastName: "Mertz",
          id: 177,
        },
        id: Math.random(),
        message: information,
        sentOn: new Date(),
      },
    ]);
  }

  useEffect(() => {
    connection?.on("ReceiveMessage", receiveMessageHandler);

    return () => {
      connection?.off("ReceiveMessage", receiveMessageHandler);
    };
  }, [connection, setRealtimeHistory]);

  return (
    <>
      {realtimeHistory.map((h) => (
        <Message history={h} key={h.id} loggedInUserId={loggedInUserId} />
      ))}
    </>
  );
}

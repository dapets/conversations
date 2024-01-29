"use client";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { Message } from "./Message";
import { HistoryEntity } from "utils/types/dbEntities";
import { SignalRConnectionContext } from "./SignalRProvider";

export function RealtimeHistory({
  loggedInUserId,
  scrollToId,
}: {
  loggedInUserId: number;
  scrollToId?: string;
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

  //using useEffect leads to visual glitches when a lot of messages arrive
  useLayoutEffect(() => {
    const scrollToElement = document.querySelector("#" + scrollToId);
    if (!scrollToElement) {
      console.info("New chat message but no element to scroll to.");
      return;
    }
    scrollToElement.scrollIntoView();
  }, [scrollToId, realtimeHistory]);

  return (
    <>
      {realtimeHistory.map((h) => (
        <Message history={h} key={h.id} loggedInUserId={loggedInUserId} />
      ))}
    </>
  );
}

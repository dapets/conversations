"use client";
import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { Message } from "./Message";
import { HistoryEntity } from "utils/dbEntities";
import { SignalRConnectionContext } from "@providers/SignalRProvider";

export function RealtimeHistory({
  loggedInUserId,
  scrollToId,
}: {
  loggedInUserId: string;
  scrollToId?: string;
}) {
  const connection = useContext(SignalRConnectionContext);
  const [realtimeHistory, setRealtimeHistory] = useState<HistoryEntity[]>([]);

  const receiveMessageHandler = useCallback(
    (message: string) => {
      setRealtimeHistory((history) => [
        ...history,
        {
          author: {
            firstName: "Sophie",
            lastName: "Mertz",
            id: "c9430aad-41ed-4ff6-9d5e-639a6e387b2c",
          },
          id: Math.random(),
          message,
          sentOn: new Date(),
        },
      ]);
    },
    [setRealtimeHistory]
  );

  useEffect(() => {
    connection?.on("ReceiveMessage", receiveMessageHandler);

    return () => {
      connection?.off("ReceiveMessage", receiveMessageHandler);
    };
  }, [connection, setRealtimeHistory, receiveMessageHandler]);

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
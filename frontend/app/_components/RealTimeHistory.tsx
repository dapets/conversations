"use client";

import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { Message } from "./Message";
import { ChatRoomEntity, HistoryEntity, UserEntity } from "utils/dbEntities";
import { SignalRConnectionContext } from "@providers/SignalRProvider";
import { getLoggedInUser } from "app/actions";

export async function RealtimeHistory({
  activeChatRoom,
  scrollToId,
}: {
  activeChatRoom: ChatRoomEntity;
  scrollToId?: string;
}) {
  const connection = useContext(SignalRConnectionContext);
  const [realtimeHistory, setRealtimeHistory] = useState<HistoryEntity[]>([]);

  const receiveMessageHandler = useCallback(
    (author: UserEntity, message: string) => {
      if (!activeChatRoom.members.some((m) => m.id === author.id)) return;
      setRealtimeHistory((history) => [
        ...history,
        {
          author,
          id: Math.random(),
          message,
          sentOn: new Date(),
        },
      ]);
    },
    [setRealtimeHistory, activeChatRoom]
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

  const loggedInUser = await getLoggedInUser();
  if (!loggedInUser) throw Error("LoggedInUser null in RealTimeHistory");
  const loggedInUserId = loggedInUser.id;

  return (
    <>
      {realtimeHistory.map((h) => (
        <Message history={h} key={h.id} loggedInUserId={loggedInUserId} />
      ))}
    </>
  );
}

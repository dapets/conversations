"use client";

import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { ChatRoomEntity, HistoryEntity, UserEntity } from "utils/dbEntities";
import { SignalRConnectionContext } from "@providers/SignalRProvider";

export function RealtimeHistory({
  activeChatRoom,
  scrollToId,
  renderMessage,
}: {
  activeChatRoom: ChatRoomEntity;
  scrollToId?: string;
  renderMessage: (newMessage: HistoryEntity) => React.ReactNode;
}) {
  const connection = useContext(SignalRConnectionContext);
  const [realtimeHistory, setRealtimeHistory] = useState<HistoryEntity[]>([]);

  const receiveMessageHandler = useCallback(
    (chatRoomId: number, author: UserEntity, message: string) => {
      if (chatRoomId !== activeChatRoom.id) return;
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
    [setRealtimeHistory, activeChatRoom],
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

  return <>{realtimeHistory.map((h) => renderMessage(h))}</>;
}

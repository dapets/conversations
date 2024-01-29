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
import { messageScrollContainerId } from "utils/constants";

const intentionalUserScrollHeight = 1000;

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
    let isUserManuallyScrolledUp = false;
    const scrollToElement = document.querySelector("#" + scrollToId);
    const scrollContainer = document.querySelector(
      "#" + messageScrollContainerId,
    );
    if (scrollContainer) {
      const scrolledHeightFromBottom =
        scrollContainer?.scrollHeight - scrollContainer?.scrollTop;
      if (scrolledHeightFromBottom > intentionalUserScrollHeight) {
        isUserManuallyScrolledUp = true;
      }
      console.log("is scrolled up", isUserManuallyScrolledUp);
    } else {
      console.error(
        "Couldn't find scroll container. with id",
        messageScrollContainerId,
      );
    }
    if (!scrollToElement) {
      console.error("New chat message but no element to scroll to.");
      return;
    }
    if (!isUserManuallyScrolledUp) {
      scrollToElement.scrollIntoView();
    }
  }, [scrollToId, realtimeHistory]);

  return <>{realtimeHistory.map((h) => renderMessage(h))}</>;
}

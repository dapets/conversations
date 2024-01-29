"use client";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { HistoryEntity, UserEntity } from "utils/projectTypes";
import { useSignalR } from "@providers/SignalRProvider";
import { messageScrollContainerId } from "utils/constants";

const intentionalUserScrollHeight = 1000;

export function RealtimeHistory({
  activeChatRoomId,
  doesRoomHaveMessages: doesRoomHaveMessagesInitial,
  scrollToId,
  renderMessage,
}: {
  activeChatRoomId: number;
  doesRoomHaveMessages: boolean;
  scrollToId?: string;
  renderMessage: (newMessage: HistoryEntity) => React.ReactNode;
}) {
  const connection = useSignalR();
  const [realtimeHistory, setRealtimeHistory] = useState<HistoryEntity[]>([]);
  const [doesRoomHaveMessages, setDoesRoomHaveMessages] = useState(
    doesRoomHaveMessagesInitial,
  );

  const receiveMessageHandler = useCallback(
    (chatRoomId: number, author: UserEntity, message: string) => {
      if (chatRoomId !== activeChatRoomId) return;
      setRealtimeHistory((history) => [
        ...history,
        {
          author,
          id: Math.random(),
          message,
          sentOn: new Date().toISOString(),
        },
      ]);
      setDoesRoomHaveMessages(true);
    },
    [activeChatRoomId],
  );

  useEffect(() => {
    connection?.on("ReceiveMessage", receiveMessageHandler);

    return () => {
      connection?.off("ReceiveMessage", receiveMessageHandler);
    };
  }, [connection, receiveMessageHandler]);

  //using useEffect leads to visual glitches when a lot of messages arrive
  useLayoutEffect(() => {
    const scrollToElement = document.querySelector("#" + scrollToId);
    if (!scrollToElement) {
      console.error("New chat message but no element to scroll to.");
      return;
    }

    let isUserManuallyScrolledUp = false;
    const scrollContainer = document.querySelector(
      "#" + messageScrollContainerId,
    );

    if (scrollContainer) {
      const scrolledHeightFromBottom =
        scrollContainer?.scrollHeight - scrollContainer?.scrollTop;
      //if the user is currently exploring the chat history we don't want to scroll them down suddenly
      if (scrolledHeightFromBottom > intentionalUserScrollHeight) {
        isUserManuallyScrolledUp = true;
      }
    } else {
      console.error(
        "Couldn't find scroll container with id",
        messageScrollContainerId,
      );
    }
    if (!isUserManuallyScrolledUp) {
      scrollToElement.scrollIntoView();
    }
  }, [scrollToId, realtimeHistory]);

  //we're rendering this on the client because newly created chat rooms have no messages
  //and if we receive a new message we would have to revalidate something on the server if we wanted to render it there.
  if (!doesRoomHaveMessages)
    return (
      <li className="place-self-center">
        <p>No one has talked yet!</p>
      </li>
    );

  return <>{realtimeHistory.map((h) => renderMessage(h))}</>;
}

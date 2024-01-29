"use client";

import { useSignalR } from "@providers/SignalRProvider";
import { revalidateChatHistory } from "app/actions";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ChatRoomListEntity, UserEntity } from "utils/projectTypes";
import { getActiveChatRoomId } from "utils/utils";
import { ChatRoomDescription } from "./ChatRoomDescription";

export default function ChatRoomDescriptionList({
  loggedInUserId,
  initialChatRooms,
}: {
  loggedInUserId: string;
  initialChatRooms: ChatRoomListEntity[];
}) {
  const conn = useSignalR();
  const pathname = usePathname();
  const [chatRooms, setChatRooms] =
    useState<ChatRoomListEntity[]>(initialChatRooms);

  const activeChatRoomId = getActiveChatRoomId(pathname);
  const activeRoom = chatRooms.find((r) => r.id === activeChatRoomId);
  if (activeRoom?.isUnread) {
    activeRoom.isUnread = false;
    setChatRooms([...chatRooms]);
  }

  const handleIncomingMessage = useCallback(
    (chatRoomId: number, author: UserEntity, message: string) => {
      const roomIdx = chatRooms.findIndex((r) => r.id === chatRoomId);
      let roomMessageWasSentIn = chatRooms[roomIdx];
      if (!roomMessageWasSentIn) {
        throw Error(
          `No room with chatRoomId ${chatRoomId} of message ${message} exists`,
        );
      }

      const isRoomActiveRoom = roomMessageWasSentIn.id === activeChatRoomId;
      const isAuthorLoggedInUser = author.id === loggedInUserId;
      if (!isRoomActiveRoom && !isAuthorLoggedInUser) {
        roomMessageWasSentIn.isUnread = true;
      }
      roomMessageWasSentIn.lastMessage = {
        author,
        message,
        sentOn: new Date().toISOString(),
        id: Math.random(),
      };

      //move rooms with new messages to the top
      chatRooms.splice(roomIdx, 1);
      setChatRooms([roomMessageWasSentIn, ...chatRooms]);

      //already updating our current chat in RealTimeHistory
      if (activeChatRoomId !== chatRoomId) {
        revalidateChatHistory(chatRoomId);
      }
    },
    [chatRooms, setChatRooms, activeChatRoomId, loggedInUserId],
  );

  useEffect(() => {
    if (!conn) return;
    conn.on("ReceiveMessage", handleIncomingMessage);
    return () => conn.off("ReceiveMessage", handleIncomingMessage);
  }, [conn, handleIncomingMessage]);

  return (
    <ul className="space-y-3">
      {chatRooms.map((chatRoom) => (
        <li key={chatRoom.id}>
          <ChatRoomDescription
            chatRoom={chatRoom}
            isActive={activeChatRoomId === chatRoom.id}
            loggedInUserId={loggedInUserId}
            isUnread={chatRoom.isUnread}
          />
        </li>
      ))}
    </ul>
  );
}

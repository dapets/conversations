"use client";

import { SignalRConnectionContext } from "@providers/SignalRProvider";
import { revalidateChatHistory } from "app/actions";
import { usePathname } from "next/navigation";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  ChatRoomEntity,
  ChatRoomListEntity,
  UserEntity,
} from "utils/dbEntities";
import { getActiveChatRoomId } from "utils/utils";

export default function ChatRoomDescriptionList({
  chatRooms: initalChatRooms,
  renderChatRoomDescription,
}: {
  chatRooms: ChatRoomListEntity[];
  renderChatRoomDescription: (
    chatRoom: ChatRoomEntity,
    isActive: boolean,
    isUnread?: boolean
  ) => React.ReactNode;
}) {
  const conn = useContext(SignalRConnectionContext);
  const pathname = usePathname();
  const [chatRooms, setChatRooms] = useState(initalChatRooms);

  const activeChatRoomId = getActiveChatRoomId(pathname);
  const activeRoom = chatRooms.find((r) => r.id === activeChatRoomId);
  if (activeRoom?.isUnread) {
    activeRoom.isUnread = false;
    setChatRooms([...chatRooms]);
  }

  const handleIncomingMessage = useCallback(
    (chatRoomId: number, author: UserEntity, message: string) => {
      let room = chatRooms.find((r) => r.id === chatRoomId);
      if (!room)
        throw Error(
          `No room with chatRoomId ${chatRoomId} of message ${message} exists`
        );
      if (room.id !== activeChatRoomId) {
        room.isUnread = true;
      }
      room.lastMessage = {
        author,
        message,
        sentOn: new Date(),
        id: Math.random(),
      };

      chatRooms.sort(
        (a, b) =>
          new Date(b.lastMessage?.sentOn ?? 0).getTime() -
          new Date(a.lastMessage?.sentOn ?? 0).getTime()
      );

      setChatRooms([...chatRooms]);

      //already updating our current chat in RealTimeHistory
      if (activeChatRoomId !== chatRoomId) {
        revalidateChatHistory(chatRoomId);
      }
    },
    [chatRooms, setChatRooms, activeChatRoomId]
  );

  useEffect(() => {
    if (!conn) return;
    conn.on("ReceiveMessage", handleIncomingMessage);
    return () => conn.off("ReceiveMessage", handleIncomingMessage);
  }, [conn, handleIncomingMessage]);

  return (
    <ul className="space-y-1">
      {chatRooms.map((chatRoom) => (
        <li key={chatRoom.id}>
          {renderChatRoomDescription(
            chatRoom,
            chatRoom.id === activeChatRoomId,
            chatRoom.isUnread
          )}
        </li>
      ))}
    </ul>
  );
}

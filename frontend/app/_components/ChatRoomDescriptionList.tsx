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
    isActive: boolean
  ) => React.ReactNode;
}) {
  const conn = useContext(SignalRConnectionContext);
  const pathname = usePathname();

  const [chatRooms, setChatRooms] = useState(initalChatRooms);

  const activeChatRoomId = getActiveChatRoomId(pathname);

  const handleIncomingMessage = useCallback(
    (chatRoomId: number, author: UserEntity, message: string) => {
      let room = chatRooms.find((r) => r.id === chatRoomId);
      if (!room) return;
      room.lastMessage = {
        author,
        message,
        sentOn: new Date(),
        id: Math.random(),
      };

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
    <ul className="space-y-1 p-2">
      {chatRooms.map((chatRoom) => (
        <li key={chatRoom.id}>
          {renderChatRoomDescription(
            chatRoom,
            chatRoom.id === activeChatRoomId
          )}
        </li>
      ))}
    </ul>
  );
}

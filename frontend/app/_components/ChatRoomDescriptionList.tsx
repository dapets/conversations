"use client";

import { SignalRConnectionContext } from "@providers/SignalRProvider";
import { usePathname } from "next/navigation";
import { useCallback, useContext, useEffect } from "react";
import {
  ChatRoomEntity,
  ChatRoomListEntity,
  UserEntity,
} from "utils/dbEntities";

export default function ChatRoomDescriptionList({
  chatRooms,
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

  const segments = pathname.split("/");
  const activeChatRoomId = +segments[2];

  const handleIncomingMessage = useCallback(
    (chatRoomId: number, author: UserEntity, message: unknown) => {
      console.log(chatRoomId, author, message);
    },
    []
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
            chatRoom.id === activeChatRoomId
          )}
        </li>
      ))}
    </ul>
  );
}

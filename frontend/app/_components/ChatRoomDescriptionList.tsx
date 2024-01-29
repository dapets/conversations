"use client";

import { ChatRoomDescription } from "@components/ChatRoomDescription";
import { SignalRConnectionContext } from "@providers/SignalRProvider";
import { usePathname } from "next/navigation";
import { useCallback, useContext, useEffect } from "react";
import { ChatRoomListEntity, UserEntity } from "utils/dbEntities";

export default function ChatRoomDescriptionList({
  chatRooms,
}: {
  chatRooms: ChatRoomListEntity[];
}) {
  const conn = useContext(SignalRConnectionContext);
  const pathname = usePathname();

  const segments = pathname.split("/");
  const activeUserId = +segments[2];

  const handleIncomingMessage = useCallback(
    (author: UserEntity, message: unknown) => {
      console.log(author, message);
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
      {chatRooms.map((chatRoom, i) => (
        <li key={i}>
          <ChatRoomDescription
            chatRoom={chatRoom}
            isActive={chatRoom.id === activeUserId}
          />
        </li>
      ))}
    </ul>
  );
}

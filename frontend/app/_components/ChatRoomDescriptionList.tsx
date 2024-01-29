"use client";

import { ChatRoomDescription } from "@components/ChatRoomDescription";
import { usePathname } from "next/navigation";
import { ChatRoomListEntity } from "utils/dbEntities";

export default function ChatRoomDescriptionList({
  chatRooms,
}: {
  chatRooms: ChatRoomListEntity[];
}) {
  const pathname = usePathname();

  const segments = pathname.split("/");
  const activeUserId = +segments[2];

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

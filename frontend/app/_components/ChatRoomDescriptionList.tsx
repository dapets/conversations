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
          {/* using u[0] because the second member is (currently) the logged in user */}
          {/* need a proper way to handle multiple people in a chat room */}
          <ChatRoomDescription
            chatRoom={chatRoom}
            isActive={chatRoom.id === activeUserId}
          />
        </li>
      ))}
    </ul>
  );
}

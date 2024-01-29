"use client";

import { ChatDescription } from "@components/ChatDescription";
import { usePathname } from "next/navigation";
import { User } from "types/dbEntities";

export default function ChatDescriptionList({
  chatList,
}: {
  chatList: User[][];
}) {
  const pathname = usePathname();

  const segments = pathname.split("/");
  const activeUserId = +segments[2];

  return (
    <ul className="space-y-1">
      {chatList.map((u, i) => (
        <li key={i}>
          {/* using u[1] because the first member is (currently) the logged in user */}
          <ChatDescription user={u[1]} isActive={u[1].id === activeUserId} />
        </li>
      ))}
    </ul>
  );
}

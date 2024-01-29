"use client";

import { ChatDescription } from "@components/ChatDescription";
import { usePathname } from "next/navigation";
import { sampleUsers } from "utils/sampleData";

export default function SampleDataChatList() {
  const pathname = usePathname();

  return (
    <ul className="space-y-1">
      {sampleUsers.map((u, i) => (
        <li key={i}>
          <ChatDescription
            username={u.username}
            isActive={decodeURI(pathname).endsWith(u.username)}
          />
        </li>
      ))}
    </ul>
  );
}

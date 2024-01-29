import React from "react";

import { sampleUsers } from "../../sampleData";
import { ChatDescription } from "@components/ChatDescription";
import { MessageInput } from "@components/MessageInput";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen">
      <section className="p-4 bg-zinc-100 overflow-y-auto">
        <ul>
          {sampleUsers.map((u, i) => (
            <li key={i}>
              <ChatDescription username={u.username} />
            </li>
          ))}
        </ul>
      </section>
      <main className="flex flex-col justify-between p-4 w-full">
        {children}
        <MessageInput />
      </main>
    </div>
  );
}

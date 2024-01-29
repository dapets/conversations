import React from "react";

import { sampleUsers, sampleChatHistory } from "../../sampleData";
import { ChatDescription } from "@components/ChatDescription";
import { ChatMessage } from "@components/ChatMessage";
import { MessageInput } from "@components/MessageInput";

export default function ClientLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { name: string };
}) {
  console.log(params);
  return (
    <div className="flex h-screen w-screen">
      <section className="p-4 bg-zinc-100">
        <ul>
          {sampleUsers.map((u, i) => (
            <li key={i}>
              <ChatDescription name={u.name} />
            </li>
          ))}
        </ul>
      </section>
      <main className="flex flex-col justify-between p-4 w-full">
        <ul>
          {sampleChatHistory.messages.map((m, i) => (
            <li key={i} className="mb-2">
              <ChatMessage
                author={sampleChatHistory.from}
                message={m.message}
                sentOn={m.date}
              />
            </li>
          ))}
        </ul>
        <MessageInput />
      </main>
    </div>
  );
}

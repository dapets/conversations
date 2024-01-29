import React from "react";

import { MessageInput } from "@components/MessageInput";

export default function ClientLayout({
  children,
  history,
  chatList,
}: {
  children: React.ReactNode;
  history: React.ReactNode;
  chatList: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen">
      <nav className="p-4 bg-zinc-100 overflow-y-auto hidden sm:w-56 sm:block ">
        {chatList}
      </nav>
      <main className="flex flex-col justify-between p-4 w-full">
        {history}
        <MessageInput />
      </main>
    </div>
  );
}

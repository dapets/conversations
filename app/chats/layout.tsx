import React from "react";

import { MessageInput } from "@components/MessageInput";

export default function ClientLayout({
  children,
  history,
  description,
}: {
  children: React.ReactNode;
  history: React.ReactNode;
  description: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen">
      <nav className="p-4 bg-zinc-100 overflow-y-auto hidden sm:w-56 sm:block ">
        {description}
      </nav>
      <main className="flex flex-col justify-between p-4 w-full">
        {children}
        <MessageInput />
      </main>
    </div>
  );
}

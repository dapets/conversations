import React from "react";

import { MessageInput } from "app/_components/MessageInput";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
  history: React.ReactNode;
}) {
  return (
    <main className="flex flex-col justify-between p-4 w-full">
      {children}
      <MessageInput />
    </main>
  );
}
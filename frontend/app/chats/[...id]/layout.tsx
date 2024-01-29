import React from "react";
import { MessageInput } from "@components/MessageInput";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col justify-between p-4 w-full space-y-4">
      {children}
      <MessageInput />
    </main>
  );
}

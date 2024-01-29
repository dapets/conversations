import React from "react";

import { MessageInput } from "app/_components/MessageInput";
import SampleDataChatList from "../../_components/SampleDataChatList";

export default function ClientLayout({
  children,
  history,
}: {
  children: React.ReactNode;
  history: React.ReactNode;
}) {
  return (
    <main className="flex flex-col justify-between p-4 w-full">
      {history}
      <MessageInput />
    </main>
  );
}

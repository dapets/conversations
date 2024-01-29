import DescriptionList from "@components/DescriptionList";
import React from "react";
import { getChatList } from "utils/dataFetchers";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const chats = await getChatList();

  return (
    <div className="flex h-screen w-screen">
      <nav className="p-4 overflow-y-auto md:w-64 md:block hidden">
        <DescriptionList chatList={chats} />
      </nav>
      {children}
    </div>
  );
}

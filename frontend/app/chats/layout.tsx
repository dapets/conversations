import DescriptionList from "@components/DescriptionList";
import React from "react";
import { User } from "utils/types/dbEntities";

async function getChatList() {
  const result = await fetch(process.env.BACKEND_URL + "/chats", {
    cache: "no-store",
  });
  const text = await result.text();
  return JSON.parse(text) as User[][];
}

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

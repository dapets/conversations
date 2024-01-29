import SampleDataChatList from "@components/SampleChatDescription";
import React from "react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen">
      <nav className="p-4 bg-zinc-100 overflow-y-auto hidden sm:w-56 sm:block ">
        <SampleDataChatList />
      </nav>
      {children}
    </div>
  );
}

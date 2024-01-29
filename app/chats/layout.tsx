import SampleDataChatList from "@components/SampleChatDescription";
import React from "react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen">
      <nav className="p-4 overflow-y-auto md:w-64 md:block hidden">
        <SampleDataChatList />
      </nav>
      {children}
    </div>
  );
}

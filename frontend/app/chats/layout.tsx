import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Chat Window",
  description: "Chat with other users",
};

export default async function ClientLayout({
  children,
  chatList,
}: {
  children: React.ReactNode;
  chatList: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen">
      <nav className="p-4 overflow-y-auto md:w-64 md:block hidden">
        {chatList}
      </nav>
      {children}
    </div>
  );
}

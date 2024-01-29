import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Conversations",
  description: "Your conversations",
};

export default async function ClientLayout({
  children,
  chatList,
}: {
  children: React.ReactNode;
  chatList: React.ReactNode;
}) {
  return (
    <div className="flex h-[100dvh] w-[100dvw]">
      <nav className="basis-1/3 max-w-sm shrink-0 overflow-y-auto md:block hidden">
        {chatList}
      </nav>
      <main className="h-full flex flex-col justify-between p-4 w-full space-y-4">
        {children}
      </main>
    </div>
  );
}

import { Separator } from "@shadcn/separator";
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
      <nav className="hidden md:flex flex-col basis-1/3 max-w-sm shrink-0 p-2">
        <h1 className="text-2xl mb-2">Messages</h1>
        <div className="overflow-y-auto">{chatList}</div>
      </nav>
      <main className="h-full flex flex-col justify-between p-4 w-full space-y-4">
        {children}
      </main>
    </div>
  );
}

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
      <nav className="basis-1/5 shrink-0 p-4 overflow-y-auto md:w-64 md:block hidden">
        {chatList}
      </nav>
      <section className="flex-grow overflow-y-auto p-4 pl-0 pr-0">
        {children}
      </section>
    </div>
  );
}

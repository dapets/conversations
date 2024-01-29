import { TypographyH2 } from "@shadcn/TypographyH1";
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
        <TypographyH2 className="mb-2">Messages</TypographyH2>
        <div className="overflow-y-auto pr-2">{chatList}</div>
      </nav>
      <main className="h-full flex flex-col justify-between p-4 pl-0 pt-2 w-full space-y-4">
        {children}
      </main>
    </div>
  );
}

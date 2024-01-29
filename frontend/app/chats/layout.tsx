import { ScrollArea } from "@shadcn/ScrollArea";
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
      <nav className="hidden lg:flex flex-col basis-1/3 max-w-sm shrink-0 p-2">
        <TypographyH2 className="mb-2">Messages</TypographyH2>
        <ScrollArea className="pr-4" type="always" data-state="visible">
          {chatList}
        </ScrollArea>
      </nav>
      <main className="flex flex-col lg:ml-0 ml-2 h-full justify-between py-2 w-full space-y-4">
        {children}
      </main>
    </div>
  );
}

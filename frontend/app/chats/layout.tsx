import { LogoutButton } from "@components/LogoutButton";
import { ScrollArea } from "@shadcn/ScrollArea";
import { TypographyH2 } from "@shadcn/TypographyH1";
import { TypographyLarge } from "@shadcn/TypographyLarge";
import { Avatar, AvatarFallback } from "@shadcn/avatar";
import { Button } from "@shadcn/button";
import { getLoggedInUser } from "app/dataFetchers";
import { Metadata } from "next";
import React from "react";
import { getUserDisplayName, getUserInitials } from "utils/utils";

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
  const loggedInUser = await getLoggedInUser();

  return (
    <div className="flex h-[100dvh] w-[100dvw]">
      <nav className="ml-2 hidden max-w-sm shrink-0 basis-1/3 flex-col bg-background p-2 lg:flex">
        <div className="mb-2 mr-6 grid grid-cols-logged-in-statusbar items-center justify-around rounded-lg border border-blue-100 p-2 shadow shadow-blue-100 grid-areas-logged-in-statusbar">
          <Avatar className="mr-2 grid-in-avatar">
            <AvatarFallback>{getUserInitials(loggedInUser)}</AvatarFallback>
          </Avatar>
          <TypographyLarge className="grid-in-logged-in-user-name">
            {getUserDisplayName(loggedInUser)}
          </TypographyLarge>
          <p className="text-sm text-muted-foreground grid-in-logged-in-status">
            Logged in
          </p>
          <LogoutButton className="justify-self-end grid-in-log-out " />
        </div>
        <TypographyH2 className="mb-4">Messages</TypographyH2>
        <ScrollArea className="pr-6" type="always" data-state="visible">
          {chatList}
        </ScrollArea>
      </nav>
      <main className="ml-2 flex h-full w-full flex-col justify-between space-y-4 py-2 lg:ml-2">
        {children}
      </main>
    </div>
  );
}

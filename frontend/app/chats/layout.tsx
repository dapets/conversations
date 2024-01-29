import { AddChatButton } from "@components/AddChatButton";
import { LogoutButton } from "@components/LogoutButton";
import { ScrollArea } from "@shadcn/ScrollArea";
import { TypographyH2 } from "@shadcn/TypographyH1";
import { TypographyLarge } from "@shadcn/TypographyLarge";
import { Avatar, AvatarFallback } from "@shadcn/avatar";
import { Button } from "@shadcn/button";
import { logout } from "app/actions";
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
        <div className="mr-4 grid grid-cols-logged-in-statusbar items-center justify-around rounded-lg border p-2 shadow-lg shadow-accent grid-areas-logged-in-statusbar">
          <Avatar className="mr-2 grid-in-avatar">
            <AvatarFallback>{getUserInitials(loggedInUser)}</AvatarFallback>
          </Avatar>
          <TypographyLarge className="grid-in-logged-in-user-name">
            {getUserDisplayName(loggedInUser)}
          </TypographyLarge>
          <p className="text-sm text-muted-foreground grid-in-logged-in-status">
            Logged in
          </p>
          <LogoutButton className="justify-self-end grid-in-log-out" />
        </div>
        <div className="mb-4 mr-6 mt-5 flex justify-between">
          <TypographyH2>Messages</TypographyH2>
          <AddChatButton />
        </div>
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

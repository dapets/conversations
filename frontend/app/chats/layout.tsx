import { AddChatIconButton } from "@components/AddChatIconButton";
import { AddChatDialog } from "@components/AddChatDialog";
import { LogoutButton } from "@components/LogoutButton";
import { ScrollArea } from "@shadcn/ScrollArea";
import { TypographyH2 } from "@shadcn/TypographyH1";
import { TypographyLarge } from "@shadcn/TypographyLarge";
import { Avatar, AvatarFallback } from "@shadcn/avatar";
import { getLoggedInUser } from "app/dataFetchers";
import { Metadata } from "next";
import React from "react";
import { getUserDisplayName, getUserInitials } from "utils/utils";
import { mainId, navBarId } from "utils/constants";

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
    <div className="flex">
      <AddChatDialog />
      <nav
        id={navBarId}
        suppressHydrationWarning
        //the default "flex"'s specificity isn't high enough, that's why we use [&:not(#fakeId)]:lg:flex
        className="ml-2 flex shrink-0 basis-full flex-col bg-background p-2 data-[is-chat-room-selected=false]:hidden lg:max-w-lg lg:basis-1/3 [&:not(#fakeId)]:lg:flex"
      >
        <div className="mr-6 grid grid-cols-logged-in-statusbar items-center justify-around rounded-lg border p-2 shadow-lg shadow-accent grid-areas-logged-in-statusbar">
          <Avatar className="mr-2 grid-in-avatar">
            <AvatarFallback>{getUserInitials(loggedInUser)}</AvatarFallback>
          </Avatar>
          <TypographyLarge className="grid-in-logged-in-user-name">
            {getUserDisplayName(loggedInUser)}
          </TypographyLarge>
          <p className="text-sm text-muted-foreground grid-in-logged-in-status">
            {loggedInUser.email ?? "No email available."}
          </p>
          <LogoutButton className="justify-self-end grid-in-log-out" />
        </div>
        <div className="mb-4 mr-6 mt-5 flex justify-between">
          <TypographyH2>Messages</TypographyH2>
          <AddChatIconButton />
        </div>
        <ScrollArea className="pr-6" type="always" data-state="visible">
          {chatList}
        </ScrollArea>
      </nav>
      <main
        id={mainId}
        suppressHydrationWarning
        className="ml-2 hidden h-full w-full grid-rows-[auto_1fr_auto] gap-y-4 py-2 data-[is-chat-room-selected=true]:grid lg:ml-2 lg:grid"
      >
        {children}
      </main>
    </div>
  );
}

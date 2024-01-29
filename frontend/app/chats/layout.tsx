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
      <nav className="hidden bg-background lg:flex flex-col basis-1/3 max-w-sm shrink-0 p-2 *:pr-4">
        <div className="grid items-center justify-around border rounded-lg gap-x-4 pt-2 pl-2 pb-2 mb-2 grid-areas-logged-in-statusbar grid-cols-logged-in-statusbar">
          <Avatar className="grid-in-avatar">
            <AvatarFallback>{getUserInitials(loggedInUser)}</AvatarFallback>
          </Avatar>
          <TypographyLarge className="grid-in-logged-in-user-name">
            {getUserDisplayName(loggedInUser)}
          </TypographyLarge>
          <p className="grid-in-logged-in-status text-sm text-muted-foreground">
            Logged in
          </p>
          <Button className="grid-in-log-out w-1/2" variant="ghost">
            Log out
          </Button>
        </div>
        <TypographyH2 className="mb-4">Messages</TypographyH2>
        <ScrollArea type="always" data-state="visible">
          {chatList}
        </ScrollArea>
      </nav>
      <main className="flex flex-col lg:ml-0 ml-2 h-full justify-between py-2 w-full space-y-4">
        {children}
      </main>
    </div>
  );
}

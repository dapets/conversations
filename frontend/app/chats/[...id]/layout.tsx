import React from "react";
import { MessageInput } from "@components/MessageInput";
import { getChatHistoryById, getLoggedInUser } from "app/dataFetchers";
import { TypographyH2 } from "@shadcn/TypographyH1";
import { getOtherChatUser, getUserDisplayName } from "utils/utils";
import { ScrollArea } from "@shadcn/ScrollArea";

export default async function ClientLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string[] };
}) {
  const heading = decodeURIComponent(params.id[1] ?? "Unknown user");
  return (
    <>
      <TypographyH2>{heading}</TypographyH2>
      <ScrollArea className="mr-2 pr-4" type="always">
        {children}
      </ScrollArea>
      <MessageInput className="pr-2" />
    </>
  );
}

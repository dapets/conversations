import React from "react";
import { MessageInput } from "@components/MessageInput";
import { TypographyH2 } from "@shadcn/TypographyH1";
import { ScrollArea } from "@shadcn/ScrollArea";
import { messageScrollContainerId } from "utils/constants";

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
      <ScrollArea
        viewportId={messageScrollContainerId}
        reverse
        className="mr-2 pr-4"
        type="always"
      >
        {children}
      </ScrollArea>
      <MessageInput className="pr-2" />
    </>
  );
}

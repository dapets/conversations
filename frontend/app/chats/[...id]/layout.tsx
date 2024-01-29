import React from "react";
import { MessageInput } from "@components/MessageInput";
import { TypographyH2 } from "@shadcn/TypographyH1";
import { ScrollArea } from "@shadcn/ScrollArea";
import { messageScrollContainerId } from "utils/constants";
import { Button } from "@shadcn/button";
import Link from "next/link";
import { ChevronsLeft } from "lucide-react";

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
      <Button
        asChild
        className="absolute left-2 top-2 block lg:hidden"
        variant="outline"
      >
        <Link href="/chats">
          <ChevronsLeft />
        </Link>
      </Button>
      <div className="flex items-center">
        <TypographyH2 className="mx-auto">{heading}</TypographyH2>
      </div>
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

import React, { Suspense } from "react";
import { MessageInput } from "@components/MessageInput";
import { TypographyH2 } from "@shadcn/TypographyH1";
import { ScrollArea } from "@shadcn/ScrollArea";
import { messageScrollContainerId } from "utils/constants";
import { Button } from "@shadcn/button";
import Link from "next/link";
import { ChevronsLeft, Loader2 } from "lucide-react";

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
      <div className="flex items-center">
        <TypographyH2 className="mx-auto">{heading}</TypographyH2>
      </div>
      <Button
        asChild
        className="absolute left-2 top-2 block lg:hidden"
        variant="outline"
      >
        <Link href="/chats">
          <ChevronsLeft />
        </Link>
      </Button>
      <ScrollArea
        viewportId={messageScrollContainerId}
        reverse
        className="mr-2 pr-4"
        type="always"
      >
        <Suspense
          fallback={
            //Inside a display: table from ScrollArea so any other centering method (probably?) won't work.
            //Need this extra div because translate-x on the Loader would mess up the animation.
            <div className="absolute left-1/2 top-1/2 translate-x-[-50%]">
              <Loader2 className="h-12 w-12 animate-spin" />
            </div>
          }
        >
          {children}
        </Suspense>
      </ScrollArea>
      <MessageInput className="pr-2" />
    </>
  );
}

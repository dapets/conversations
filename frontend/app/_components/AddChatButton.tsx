"use client";

import { cn } from "@/lib/utils";
import { Button } from "@shadcn/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@shadcn/tooltip";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { addChatDialogQueryParam, scrollToId } from "utils/constants";

export function AddChatButton({ className }: { className?: string }) {
  const router = useRouter();
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={async () => {
            router.push(
              "?" +
                new URLSearchParams({ [addChatDialogQueryParam]: "true" }) +
                "#" +
                scrollToId,
            );
          }}
          className={(cn("flex place-content-center"), className)}
          variant="ghost"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Add a chat</p>
      </TooltipContent>
    </Tooltip>
  );
}

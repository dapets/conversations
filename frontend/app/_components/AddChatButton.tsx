"use client";

import { cn } from "@/lib/utils";
import { Button } from "@shadcn/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@shadcn/tooltip";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { scrollToId } from "utils/constants";

export function AddChatButton({ className }: { className?: string }) {
  const router = useRouter();
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={async () => {
              router.push("?addUser=true" + "#" + scrollToId);
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
    </TooltipProvider>
  );
}

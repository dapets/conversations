"use client";

import { cn } from "@/lib/utils";
import { Button } from "@shadcn/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@shadcn/tooltip";
import useOpenAddChatDialog from "app/_hooks/useOpenAddChatDialog";
import { Plus } from "lucide-react";

export function AddChatIconButton({ className }: { className?: string }) {
  const openAddChatDialog = useOpenAddChatDialog();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={() => openAddChatDialog()}
          className={(cn("flex place-content-center"), className)}
          variant="ghost"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Add Chat</p>
      </TooltipContent>
    </Tooltip>
  );
}

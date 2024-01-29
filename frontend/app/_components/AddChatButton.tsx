"use client";

import { cn } from "@/lib/utils";
import { Button } from "@shadcn/button";
import { Plus } from "lucide-react";

export function AddChatButton({ className }: { className?: string }) {
  return (
    <Button
      onClick={async () => {}}
      className={(cn("flex place-content-center"), className)}
      variant="ghost"
    >
      <Plus className="h-6 w-6" />
    </Button>
  );
}

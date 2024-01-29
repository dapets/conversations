"use client";

import { cn } from "@/lib/utils";
import { Button } from "@shadcn/button";
import { logout } from "app/actions";

export function LogoutButton({ className }: { className?: string }) {
  return (
    <Button
      onClick={() => {
        logout();
      }}
      className={cn("font-semibold", className)}
      variant="ghost"
    >
      Log out
    </Button>
  );
}

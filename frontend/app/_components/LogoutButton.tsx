"use client";

import { cn } from "@/lib/utils";
import { Button } from "@shadcn/button";
import { logout } from "app/actions";
import { Loader2, LogOut } from "lucide-react";
import { useState } from "react";

export function LogoutButton({ className }: { className?: string }) {
  const [isLogoutPending, setIsLogoutPending] = useState(false);
  const classNames = cn("font-semibold flex items-center", className);

  if (!isLogoutPending) {
    return (
      <Button
        onClick={async () => {
          setIsLogoutPending(true);
          await logout();
        }}
        className={classNames}
        variant="ghost"
      >
        <LogOut className="h-6 w-6" />
      </Button>
    );
  } else {
    return (
      <Button disabled className={cn(className, "w-fit px-2")} variant="ghost">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" type="button" />
        Logging out...
      </Button>
    );
  }
}

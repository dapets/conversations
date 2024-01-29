import React from "react";

import { Send } from "lucide-react";
import { MessageInput } from "app/_chatComponents/MessageInput";
import { Button } from "@/components/ui/button";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col justify-between p-4 w-full space-y-4">
      {children}
      <div className="w-full flex items-center justify-between space-x-4">
        <MessageInput className="w-full" />
        <Button type="submit" className="w-10 h-10 flex">
          <Send className="w-4 h-4 m-auto" />
        </Button>
      </div>
    </main>
  );
}

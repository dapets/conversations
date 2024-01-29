import React from "react";

import { Send } from "lucide-react";
import { MessageInput } from "app/_components/MessageInput";
import { Button } from "@/components/ui/button";

export default async function ClientLayout({
  children,
  noChatSelected,
  chatList,
  params,
}: {
  children: React.ReactNode;
  noChatSelected: React.ReactNode;
  chatList: React.ReactNode;
  params: { name: string[] };
}) {
  return (
    <>
      <nav className="p-4 overflow-y-auto md:w-64 md:block hidden">
        {chatList}
      </nav>
      <main className="flex flex-col justify-between p-4 w-full space-y-4">
        {Array.isArray(params?.name) && params?.name.length > 0 ? (
          <>
            {children}
            <div className="w-full flex items-center justify-between space-x-4">
              <MessageInput className="w-full" />
              <Button type="submit" className="w-10 h-10 flex">
                <Send className="w-4 h-4 m-auto" />
              </Button>
            </div>
          </>
        ) : (
          noChatSelected
        )}
      </main>
    </>
  );
}

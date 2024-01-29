"use client";

import { cn } from "@/lib/utils";
import { SignalRConnectionContext } from "@providers/SignalRProvider";
import { Button } from "@shadcn/button";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import { maxMessageLength } from "utils/constants";
import { getActiveChatRoomId } from "utils/utils";

const messageInputName = "send-button";

export function MessageInput({ className }: { className: string }) {
  const signalRContext = useContext(SignalRConnectionContext);
  const pathname = usePathname();
  const activeChatRoomId = getActiveChatRoomId(pathname);

  return (
    <form
      className={cn(
        "flex w-full items-center justify-between space-x-4",
        className,
      )}
      onSubmit={(e) => {
        const form = e.target as HTMLElementTagNameMap["form"];
        const sendInput = form.elements.namedItem(
          messageInputName,
        ) as HTMLElementTagNameMap["input"];

        if (sendInput.value.length > 0) {
          signalRContext?.send(
            "SendMessage",
            sendInput.value,
            activeChatRoomId,
          );
        }
        sendInput.value = "";
        e.preventDefault();
      }}
    >
      <input
        name={messageInputName}
        //all these focus-visible: can't be omitted or combined because firefox
        className="flex-grow rounded-lg border-2 border-secondary p-2 focus:outline-2 focus-visible:border-transparent focus-visible:outline focus-visible:outline-primary"
        type="text"
        maxLength={maxMessageLength}
        placeholder="Type a message..."
        autoFocus
        autoComplete="off"
      />
      <Button type="submit" className="">
        Send
      </Button>
    </form>
  );
}

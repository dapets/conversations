"use client";

import { SignalRConnectionContext } from "@providers/SignalRProvider";
import { Button } from "@shadcn/button";
import { Send } from "lucide-react";
import { usePathname } from "next/navigation";
import { useContext, useEffect } from "react";
import { getActiveChatRoomId } from "utils/utils";

const messageInputName = "send-button";

export function MessageInput() {
  const signalRContext = useContext(SignalRConnectionContext);
  const pathname = usePathname();
  const activeChatRoomId = getActiveChatRoomId(pathname);

  return (
    <form
      className="w-full flex items-center justify-between space-x-4"
      onSubmit={(e) => {
        const form = e.target as HTMLElementTagNameMap["form"];
        const sendInput = form.elements.namedItem(
          messageInputName
        ) as HTMLElementTagNameMap["input"];

        if (sendInput.value.length > 0) {
          signalRContext?.send(
            "SendMessage",
            sendInput.value,
            activeChatRoomId
          );
        }
        sendInput.value = "";
        e.preventDefault();
      }}
    >
      <input
        name={messageInputName}
        //all these focus-visible: can't be omitted or combined because firefox
        className="flex-grow rounded-lg p-2 focus-visible:outline focus:outline-2 focus-visible:outline-primary focus-visible:border-transparent border-secondary border-2"
        type="text"
        placeholder="Type a message..."
        autoComplete="off"
      />
      <Button type="submit" className="w-10 h-10 flex">
        <Send className="w-4 h-4 flex-shrink-0 m-auto" />
      </Button>
    </form>
  );
}

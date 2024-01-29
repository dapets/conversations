import React from "react";
import { MessageInput } from "@components/MessageInput";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="overflow-y-auto pr-10">{children}</div>
      <MessageInput />
    </>
  );
}

"use client";

import { usePathname } from "next/navigation";
import { getActiveChatRoomId, handleIsChatRoomSelected } from "utils/utils";

export function HandleIsChatRoomSelected() {
  const pathname = usePathname();
  const activeChatRoomId = getActiveChatRoomId(pathname);
  handleIsChatRoomSelected(activeChatRoomId !== null);

  return null;
}

"use client";

import { useSignalR } from "@providers/SignalRProvider";
import { revalidateChatHistory } from "app/actions";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ChatRoomListEntity, UserEntity } from "utils/projectTypes";
import { getActiveChatRoomId, handleIsChatRoomSelected } from "utils/utils";
import { ChatRoomDescription } from "./ChatRoomDescription";
import useOpenAddChatDialog from "app/_hooks/useOpenAddChatDialog";
import { Button } from "@shadcn/button";

export default function ChatRoomDescriptionList({
  loggedInUserId,
  initialChatRooms,
}: {
  loggedInUserId: string;
  initialChatRooms: ChatRoomListEntity[];
}) {
  const conn = useSignalR();
  const pathname = usePathname();
  const [chatRooms, setChatRooms] =
    useState<ChatRoomListEntity[]>(initialChatRooms);
  const openAddChatDialog = useOpenAddChatDialog();

  const activeChatRoomId = getActiveChatRoomId(pathname);
  const activeRoom = chatRooms.find((r) => r.id === activeChatRoomId);
  if (activeRoom?.isUnread) {
    activeRoom.isUnread = false;
    setChatRooms([...chatRooms]);
  }
  handleIsChatRoomSelected(!!activeRoom);

  const handleAddNewChatRoom = useCallback(
    (chatRoomId: number, members: UserEntity[]) => {
      const newRoom: ChatRoomListEntity = {
        id: chatRoomId,
        members: members,
        isUnread: true,
      };

      setChatRooms((value) => [newRoom, ...value]);
    },
    [],
  );

  const handleIncomingMessage = useCallback(
    (chatRoomId: number, author: UserEntity, message: string) => {
      const roomMessageWasSentInIdx = chatRooms.findIndex(
        (r) => r.id === chatRoomId,
      );
      let roomMessageWasSentIn = chatRooms[roomMessageWasSentInIdx];
      if (!roomMessageWasSentIn) {
        throw Error(
          `No room with chatRoomId ${chatRoomId} of message ${message} exists`,
        );
      }

      const isRoomActiveRoom = roomMessageWasSentIn.id === activeChatRoomId;
      const isAuthorLoggedInUser = author.id === loggedInUserId;
      if (!isRoomActiveRoom && !isAuthorLoggedInUser) {
        roomMessageWasSentIn.isUnread = true;
      }
      roomMessageWasSentIn.lastMessage = {
        author,
        message,
        sentOn: new Date().toISOString(),
        id: Math.random(),
      };

      //move rooms with new messages to the top
      chatRooms.splice(roomMessageWasSentInIdx, 1);
      setChatRooms([roomMessageWasSentIn, ...chatRooms]);

      //already updating our current chat in RealTimeHistory
      if (activeChatRoomId !== chatRoomId) {
        revalidateChatHistory(chatRoomId);
      }
    },
    [chatRooms, setChatRooms, activeChatRoomId, loggedInUserId],
  );

  useEffect(() => {
    if (!conn) return;
    conn.on("ReceiveMessage", handleIncomingMessage);
    conn.on("AddChatRoom", handleAddNewChatRoom);
    return () => {
      conn.off("ReceiveMessage", handleIncomingMessage);
      conn.off("AddChatRoom", handleAddNewChatRoom);
    };
  }, [conn, handleIncomingMessage, handleAddNewChatRoom]);

  if (chatRooms.length === 0) {
    return (
      <>
        <p className="text-center">
          You haven&apos;t chatted with anyone yet.
          <br />
          You might want to:
        </p>
        <Button className="mt-4 w-full" onClick={openAddChatDialog}>
          Add your first chat
        </Button>
      </>
    );
  }

  return (
    <ul className="space-y-3">
      {chatRooms.map((chatRoom) => (
        <li key={chatRoom.id}>
          <ChatRoomDescription
            chatRoom={chatRoom}
            isActive={activeChatRoomId === chatRoom.id}
            loggedInUserId={loggedInUserId}
            isUnread={chatRoom.isUnread}
          />
        </li>
      ))}
    </ul>
  );
}

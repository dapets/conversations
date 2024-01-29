import React from "react";
import { MessageInput } from "@components/MessageInput";
import { getChatHistoryById, getLoggedInUser } from "app/dataFetchers";
import { TypographyH2 } from "@shadcn/TypographyH1";
import { getOtherChatUser, getUserDisplayName } from "utils/utils";

export default async function ClientLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string[] };
}) {
  let heading = "";
  if (params?.id[0]) {
    const chatRoomId = +decodeURIComponent(params.id[0]);
    const [chatRoom, loggedInUser] = await Promise.all([
      getChatHistoryById(chatRoomId),
      getLoggedInUser(),
    ]);
    const otherUser = getOtherChatUser(chatRoom.members, loggedInUser.id);
    heading = getUserDisplayName(otherUser);
  }
  return (
    <>
      <TypographyH2>{heading}</TypographyH2>
      <div className="overflow-y-auto pr-10">{children}</div>
      <MessageInput />
    </>
  );
}

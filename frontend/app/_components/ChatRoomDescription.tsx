import { Avatar, AvatarFallback } from "@shadcn/avatar";
import Link from "next/link";
import { getRelativeLocalTimeStrFromUtcDate } from "utils/configuredDayjs";
import { scrollToId } from "utils/constants";
import { ChatRoomListEntity } from "utils/dbEntities";
import "./ChatRoomdescription.css";
import { getOtherChatUser, getUserDisplayName } from "utils/utils";
import { TypographyMuted } from "@shadcn/TypographyMuted";
import { TypographyLarge } from "@shadcn/TypographyLarge";

export function ChatRoomDescription({
  chatRoom,
  loggedInUserId,
  isActive,
}: {
  chatRoom: ChatRoomListEntity;
  loggedInUserId: string;
  isActive: boolean;
}) {
  const otherChatUser = getOtherChatUser(chatRoom.members, loggedInUserId);
  const otherChatUserFullName = getUserDisplayName(otherChatUser);

  const encodedHref =
    "/chats/" +
    chatRoom.id +
    "/" +
    encodeURIComponent(otherChatUserFullName) +
    "#" +
    scrollToId;

  return (
    <Link href={encodedHref}>
      {/* Padding behaves weird if I style the <Link> directly, don't know why*/}
      <div
        data-isactive={isActive}
        //tailwind doesn't really support grid-template-areas but specifying col-start- and row-start- got pretty messy.
        //Because of that I'm just gonna use the custom css class `chat-room-description-layout` defined in ChatRoomDescription.css
        className="grid chat-room-description-layout p-2 rounded-lg data-[isactive=true]:bg-primary data-[isactive=true]:text-primary-foreground hover:bg-primary hover:text-primary-foreground "
      >
        <Avatar className="text-primary [grid-area:avatar] place-self-center mr-2">
          <AvatarFallback>
            {otherChatUser.firstName[0]}
            {otherChatUser.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <TypographyLarge className="truncate [grid-area:username]">
          {otherChatUserFullName}
        </TypographyLarge>
        {chatRoom.lastMessage && (
          <time suppressHydrationWarning className="text-sm">
            {getRelativeLocalTimeStrFromUtcDate(chatRoom.lastMessage?.sentOn)}
          </time>
        )}
        <p className="truncate font-normal text-left [grid-area:last-message]">
          {chatRoom.lastMessage?.message ?? "No messages yet."}
        </p>
      </div>
    </Link>
  );
}

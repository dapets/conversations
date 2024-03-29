import { Avatar, AvatarFallback } from "@shadcn/avatar";
import Link from "next/link";
import { ChatRoomListEntity } from "utils/projectTypes";
import {
  getOtherChatUser,
  getUserDisplayName,
  getUserInitials,
} from "utils/utils";
import { TypographyLarge } from "@shadcn/TypographyLarge";
import { cn } from "@/lib/utils";
import { scrollToId } from "utils/constants";
import { AutoUpdatingRelativeTime } from "./AutoUpdatingRelativeTime";

export function ChatRoomDescription({
  chatRoom,
  loggedInUserId,
  isActive,
  isUnread,
}: {
  chatRoom: ChatRoomListEntity;
  loggedInUserId: string;
  isActive: boolean;
  isUnread?: boolean;
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

  const isLastMessageAvailable = chatRoom.lastMessage?.message;

  return (
    <Link href={encodedHref}>
      {/* Padding behaves weird if I style the <Link> directly, don't know why*/}
      <div
        //tailwind doesn't really support grid-template-areas but specifying col-start- and row-start- got pretty messy.
        //Because of that I'm just gonna use the custom css class `chat-room-description-layout` defined in ChatRoomDescription.css
        className={cn(
          "grid grid-cols-chat-room-description grid-areas-chat-room-description " +
            "rounded-lg p-2 " +
            "hover:bg-primary hover:text-primary-foreground ",

          {
            "bg-primary text-primary-foreground ": isActive,
          },
        )}
      >
        {isUnread && (
          <span
            className={
              "self-center grid-in-unread-notifier " +
              "h-3 w-3 " +
              "rounded-full bg-sky-500"
            }
          />
        )}
        <Avatar className="mr-2 place-self-center text-black [grid-area:avatar]">
          <AvatarFallback>{getUserInitials(otherChatUser)}</AvatarFallback>
        </Avatar>
        <TypographyLarge className="truncate [grid-area:username]">
          {otherChatUserFullName}
        </TypographyLarge>
        {chatRoom.lastMessage && (
          <AutoUpdatingRelativeTime
            key={chatRoom.lastMessage?.sentOn}
            date={chatRoom.lastMessage.sentOn}
            className="text-right text-sm grid-in-last-message-date"
          />
        )}
        <p
          className={cn("truncate text-left font-normal grid-in-last-message", {
            italic: !isLastMessageAvailable,
          })}
        >
          {chatRoom.lastMessage?.message ?? "No messages yet."}
        </p>
      </div>
    </Link>
  );
}

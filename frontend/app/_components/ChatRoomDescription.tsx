import { Avatar, AvatarFallback } from "@shadcn/avatar";
import Link from "next/link";
import { getRelativeLocalTimeStrFromUtcDate } from "utils/configuredDayjs";
import { ChatRoomListEntity } from "utils/dbEntities";
import {
  getOtherChatUser,
  getUserDisplayName,
  getUserInitials,
} from "utils/utils";
import { TypographyLarge } from "@shadcn/TypographyLarge";
import { cn } from "@/lib/utils";

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
    "/chats/" + chatRoom.id + "/" + encodeURIComponent(otherChatUserFullName);

  console.log(isActive);
  return (
    <Link href={encodedHref}>
      {/* Padding behaves weird if I style the <Link> directly, don't know why*/}
      <div
        //tailwind doesn't really support grid-template-areas but specifying col-start- and row-start- got pretty messy.
        //Because of that I'm just gonna use the custom css class `chat-room-description-layout` defined in ChatRoomDescription.css
        className={cn(
          "grid grid-areas-chat-room-description grid-cols-chat-room-description " +
            "p-2 rounded-lg shadow " +
            "hover:bg-primary hover:text-primary-foreground hover:shadow-md",

          {
            " bg-primary text-primary-foreground shadow-md ": isActive,
          }
        )}
      >
        {isUnread && (
          <span
            className={
              "grid-in-unread-notifier self-center " +
              "h-3 w-3 " +
              "rounded-full bg-sky-500"
            }
          />
        )}
        <Avatar className="text-black [grid-area:avatar] place-self-center mr-2">
          <AvatarFallback>{getUserInitials(otherChatUser)}</AvatarFallback>
        </Avatar>
        <TypographyLarge className="truncate [grid-area:username]">
          {otherChatUserFullName}
        </TypographyLarge>
        {chatRoom.lastMessage && (
          <time
            suppressHydrationWarning
            className="text-sm text-right grid-in-last-message-date"
          >
            {getRelativeLocalTimeStrFromUtcDate(chatRoom.lastMessage?.sentOn)}
          </time>
        )}
        <p className="truncate font-normal text-left grid-in-last-message">
          {chatRoom.lastMessage?.message ?? "No messages yet."}
        </p>
      </div>
    </Link>
  );
}

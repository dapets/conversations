import { Avatar, AvatarFallback } from "@shadcn/avatar";
import Link from "next/link";
import { getRelativeLocalTimeStrFromUtcDate } from "utils/configuredDayjs";
import { scrollToId } from "utils/constants";
import { ChatRoomListEntity } from "utils/dbEntities";
import "./ChatRoomdescription.css";

export function ChatRoomDescription({
  chatRoom,
  loggedInUserId,
  isActive,
}: {
  chatRoom: ChatRoomListEntity;
  loggedInUserId: string;
  isActive: boolean;
}) {
  //currently assuming we only have chat rooms with two (logged in + additional) member
  const otherChatUser = chatRoom.members.filter(
    (member) => member.id !== loggedInUserId ?? Number.NaN
  )[0];
  const otherChatUserFullName = `${otherChatUser.firstName} ${otherChatUser.lastName}`;

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
        <Avatar className="text-primary [grid-area:avatar] mr-2">
          <AvatarFallback>
            {otherChatUser.firstName[0]}
            {otherChatUser.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-sm font-bold truncate [grid-area:username]">
          {otherChatUserFullName}
        </h2>
        {chatRoom.lastMessage && (
          <p className="text-xs truncate text-right [grid-area:last-message-date]">
            {getRelativeLocalTimeStrFromUtcDate(chatRoom.lastMessage?.sentOn)}
          </p>
        )}
        <p className="text-sm truncate font-normal text-left [grid-area:last-message]">
          {chatRoom.lastMessage?.message ?? "No messages yet."}
        </p>
      </div>
    </Link>
  );
}

import { Avatar, AvatarFallback } from "@shadcn/avatar";
import Link from "next/link";
import { getRelativeLocalTimeStrFromUtcDate } from "utils/configuredDayjs";
import { scrollToId } from "utils/constants";
import { ChatRoomListEntity } from "utils/dbEntities";

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
        className="p-2 grid grid-cols-[auto_1fr_auto] grid-rows-2 rounded-lg data-[isactive=true]:bg-primary data-[isactive=true]:text-primary-foreground hover:bg-primary hover:text-primary-foreground "
      >
        <Avatar className="text-primary row-span-2 mr-2">
          <AvatarFallback>
            {otherChatUser.firstName[0]}
            {otherChatUser.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-sm font-bold truncate">{otherChatUserFullName}</h2>
        <p className="row-start-2 col-start-2 col-span-2 text-sm truncate font-normal">
          {chatRoom.lastMessage?.message ?? "No messages yet."}
        </p>
        {chatRoom.lastMessage && (
          <p className="text-xs truncate">
            {getRelativeLocalTimeStrFromUtcDate(chatRoom.lastMessage?.sentOn)}
          </p>
        )}
      </div>
    </Link>
  );
}

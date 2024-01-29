import { getLoggedInUser } from "app/actions";
import Link from "next/link";
import { scrollToId } from "utils/constants";
import { ChatRoomListEntity } from "utils/dbEntities";

export async function ChatRoomDescription({
  chatRoom,
  isActive,
}: {
  chatRoom: ChatRoomListEntity;
  isActive: boolean;
}) {
  //currently assuming we only have chat rooms with two (logged in + additional) member
  const loggedInUser = await getLoggedInUser();

  const otherChatUser = chatRoom.members.filter(
    (member) => member.id !== loggedInUser?.id ?? Number.NaN
  )[0];
  const encodedHref =
    "/chats/" +
    chatRoom.id +
    "/" +
    encodeURIComponent(`${otherChatUser.firstName} ${otherChatUser.lastName}`) +
    "#" +
    scrollToId;

  return (
    <Link href={encodedHref}>
      {/* Padding behaves weird if I style the <Link> directly, don't know why*/}
      <div
        data-isactive={isActive}
        className="p-2 data-[isactive=true]:bg-primary data-[isactive=true]:text-primary-foreground hover:bg-primary hover:text-primary-foreground rounded-lg"
      >
        <h2 className="text-sm font-bold truncate">{`${otherChatUser.firstName} ${otherChatUser.lastName}`}</h2>
        <p className="text-sm truncate font-light">
          {chatRoom.lastMessage?.message ?? "No messages yet."}
        </p>
      </div>
    </Link>
  );
}

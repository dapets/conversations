import { scrollToId } from "app/chats/[...name]/page";
import Link from "next/link";
import { UserEntity } from "utils/types/dbEntities";

export function ChatDescription({
  user,
  isActive,
  lastMessage,
}: {
  user: UserEntity;
  isActive: boolean;
  lastMessage?: string;
}) {
  const encodedHref =
    "/chats/" +
    user.id +
    "/" +
    encodeURIComponent(`${user.firstName} ${user.lastName}`) +
    "#" +
    scrollToId;

  return (
    <Link href={encodedHref}>
      {/* Padding behaves weird if I style the <Link> directly, don't know why*/}
      <div
        data-isactive={isActive}
        className="p-2 data-[isactive=true]:bg-primary data-[isactive=true]:text-primary-foreground hover:bg-primary hover:text-primary-foreground rounded-lg"
      >
        <h2 className="text-sm font-bold truncate">{`${user.firstName} ${user.lastName}`}</h2>
        <p className="text-sm truncate font-light">
          {lastMessage ?? "No messages yet."}
        </p>
      </div>
    </Link>
  );
}

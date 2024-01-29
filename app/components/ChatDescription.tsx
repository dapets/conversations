import Link from "next/link";

export function ChatDescription(props: {
  username: string;
  lastMessage?: string;
}) {
  const encodedHref = "/chats/" + encodeURIComponent(props.username);

  return (
    <Link href={encodedHref} scroll={false}>
      {/* Padding behaves weird if I style the <Link> directly, don't know why*/}
      <div className="p-1">
        <h2 className="text-sm font-bold truncate">{props.username}</h2>
        <p className="text-sm truncate font-light ">
          {props.lastMessage ?? "No messages yet."}
        </p>
      </div>
    </Link>
  );
}

import Link from "next/link";

export function ChatDescription(props: {
  name: string;
  lastMessage?: string;
  isSelected?: boolean;
}) {
  return (
    <Link href={"/chats/" + props.name}>
      {/* Padding behaves weird if I style the <Link> directly, don't know why*/}
      <div className="p-1">
        <h2 className="text-sm font-bold">{props.name}</h2>
        <p className="text-sm truncate font-light">
          {props.lastMessage ?? "No messages yet."}
        </p>
      </div>
    </Link>
  );
}

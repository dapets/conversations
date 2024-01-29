import { ChatDescription } from "@components/ChatDescription";
import { User } from "types/dbEntities";

export default async function ChatDescriptionList({
  chatList,
}: {
  chatList: User[][];
}) {
  return (
    <ul className="space-y-1">
      {chatList.map((u, i) => (
        <li key={i}>
          <ChatDescription user={u[1]} isActive={false} />
        </li>
      ))}
    </ul>
  );
}

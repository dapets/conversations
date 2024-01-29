import { ChatDescription } from "@components/ChatDescription";
import { User } from "types/dbEntities";

async function getChatList() {
  const result = await fetch(process.env.BACKEND_URL + "/chats", {
    cache: "no-store",
  });
  const text = await result.text();
  return JSON.parse(text) as User[][];
}

export default async function ChatList() {
  const chats = await getChatList();
  return (
    <ul className="space-y-1">
      {chats.map((u, i) => (
        <li key={i}>
          <ChatDescription user={u[1]} isActive={false} />
        </li>
      ))}
    </ul>
  );
}

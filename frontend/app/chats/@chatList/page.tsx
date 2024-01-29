import ChatDescriptionList from "@components/ChatDescriptionList";
import { getChatList } from "app/actions";

export default async function ChatDescriptionListPage() {
  const chats = await getChatList();
  if (!chats) throw new Error("Fetching chat list failed");

  return <ChatDescriptionList chatList={chats} />;
}

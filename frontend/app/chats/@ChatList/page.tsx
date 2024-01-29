import ChatDescriptionList from "@components/ChatDescriptionList";
import { getChatList } from "utils/dataFetchers";

export default async function ChatDescriptionListPage() {
  const chats = await getChatList();

  return <ChatDescriptionList chatList={chats} />;
}

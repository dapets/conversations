import ChatDescriptionList from "@components/ChatDescriptionList";
import { getChatList } from "app/actions";
import { redirect } from "next/navigation";

export default async function ChatDescriptionListPage() {
  const chats = await getChatList();

  if (!chats) redirect("/login");

  return <ChatDescriptionList chatList={chats} />;
}

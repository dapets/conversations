//Needs to be a default.tsx und not a page.tsx because @chatList would be null on routes like /chats/chatter-id
//more info: https://nextjs.org/docs/app/building-your-application/routing/parallel-routes#defaultjs
import ChatDescriptionList from "@components/ChatDescriptionList";
import { getChatList } from "app/actions";

export default async function ChatDescriptionListPage() {
  const chats = await getChatList();
  if (!chats) throw new Error("Fetching chat list failed");

  return <ChatDescriptionList chatList={chats} />;
}

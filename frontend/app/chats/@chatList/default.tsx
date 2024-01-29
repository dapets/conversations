//Needs to be a default.tsx und not a page.tsx because @chatList would be null on routes like /chats/chatter-id
//more info: https://nextjs.org/docs/app/building-your-application/routing/parallel-routes#defaultjs
import ChatRoomDescriptionList from "@components/ChatRoomDescriptionList";
import { getChatRoomsList } from "app/actions";

export default async function ChatDescriptionListPage() {
  const chatRooms = await getChatRoomsList();
  if (!chatRooms) throw new Error("Fetching chat list failed");

  return <ChatRoomDescriptionList chatRooms={chatRooms} />;
}

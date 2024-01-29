//Needs to be a default.tsx und not a page.tsx because @chatList would be null on routes like /chats/chatter-id
//more info: https://nextjs.org/docs/app/building-your-application/routing/parallel-routes#defaultjs
import ChatRoomDescriptionList from "@components/ChatRoomDescriptionList";
import { getLoggedInUser } from "app/dataFetchers";

export default async function ChatDescriptionListPage() {
  const loggedInUser = await getLoggedInUser();

  if (!loggedInUser) throw Error("Fetching logged in user failed");

  return <ChatRoomDescriptionList loggedInUserId={loggedInUser.id} />;
}

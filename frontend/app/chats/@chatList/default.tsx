//Needs to be a default.tsx und not a page.tsx because @chatList would be null on routes like /chats/chatter-id
//more info: https://nextjs.org/docs/app/building-your-application/routing/parallel-routes#defaultjs
import { getChatRoomsList, getLoggedInUser } from "app/dataFetchers";
import { ChatListWithServerSideProps } from "./ChatListWithServerSideProps";

export default async function ChatDescriptionListPage() {
  const chatRooms = await getChatRoomsList();
  const loggedInUser = await getLoggedInUser();
  if (!chatRooms) throw Error("Fetching chat list failed");
  if (!loggedInUser) throw Error("Fetching logged in user failed");

  return (
    <ChatListWithServerSideProps
      chatRooms={chatRooms}
      loggedInUserId={loggedInUser.id}
    />
  );
}

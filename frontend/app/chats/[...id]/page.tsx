import { Message } from "@components/Message";
import { scrollToId } from "utils/constants";
import { getChatHistoryById, getLoggedInUser } from "app/dataFetchers";
import { RealTimeHistoryWithServerSideProps } from "./RealTimeHistoryWithServerSideProps";

export default async function ChatHistory({
  params,
}: {
  params: { id: string[] };
}) {
  if (!params?.id) throw new Error("params or id undefined");
  const chatRoomId = +decodeURIComponent(params.id[0]);

  const [loggedInUser, chatRoom] = await Promise.all([
    getLoggedInUser(),
    getChatHistoryById(chatRoomId),
  ]);

  const chatHistory = chatRoom.history;
  const loggedInUserId = loggedInUser.id;

  return (
    <>
      <ul className="flex flex-col space-y-2">
        {chatHistory.map((h) => (
          <li key={h.id}>
            <Message history={h} loggedInUserId={loggedInUserId} />
          </li>
        ))}
        <RealTimeHistoryWithServerSideProps
          doesRoomHaveMessages={chatHistory.length > 0}
          activeChatRoomId={chatRoom.id}
          loggedInUserId={loggedInUserId}
          scrollToId={scrollToId}
        />
        <li className="h-0 w-0" id={scrollToId} />
      </ul>
      {/* we're using this element to scroll to the latest chat message */}
    </>
  );
}

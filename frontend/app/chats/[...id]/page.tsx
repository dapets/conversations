import { Message } from "@components/Message";
import { scrollToId } from "utils/constants";
import { getChatHistoryWithId, getLoggedInUser } from "app/dataFetchers";
import { RealTimeHistoryWithServerSideProps } from "./RealTimeHistoryWithServerSideProps";

export default async function ChatHistory({
  params,
}: {
  params: { id: string[] };
}) {
  if (!params?.id) throw new Error("params or id undefined");

  const chatRoomId = +decodeURIComponent(params.id[0]);

  const chatRoom = await getChatHistoryWithId(chatRoomId);
  const chatHistory = chatRoom.history;
  const loggedInUserId = (await getLoggedInUser())?.id;
  if (!loggedInUserId)
    throw Error("Tried to render chat history while logged in user was null");

  return (
    <section className="overflow-y-auto p-4 pl-0 pr-14">
      <ul className="flex flex-col space-y-4">
        {chatHistory.length === 0 ? (
          <li>
            <p className="m-auto">You haven&apost talked yet!</p>
          </li>
        ) : (
          chatHistory.map((h) => (
            <li key={h.id}>
              <Message history={h} loggedInUserId={loggedInUserId} />
            </li>
          ))
        )}
        <RealTimeHistoryWithServerSideProps
          activeChatRoom={chatRoom}
          loggedInUserId={loggedInUserId}
          scrollToId={scrollToId}
        />
      </ul>
      {/* we're using this element to scroll to the latest chat message */}
      <span className="w-0 h-0" id={scrollToId} />
    </section>
  );
}

import { RealtimeHistory } from "@components/RealTimeHistory";
import { Message } from "@components/Message";
import { getChatHistoryWithId, getLoggedInUser } from "app/actions";
import { scrollToId } from "utils/constants";

export default async function ChatHistory({
  params,
}: {
  params: { id: string[] };
}) {
  if (!params?.id) throw new Error("params or id undefined");

  const chatPartnerId = decodeURIComponent(params.id[0]);

  const chatHistory = await getChatHistoryWithId(chatPartnerId);
  const loggedInUserId = (await getLoggedInUser()).id;

  return (
    <section className="overflow-y-auto p-4 pl-0 pr-14">
      <ul className="flex flex-col space-y-4">
        <li>
          {chatHistory.length === 0 ? (
            <p className="m-auto">You haven&apost talked yet!</p>
          ) : (
            chatHistory.map((h) => (
              <Message key={h.id} history={h} loggedInUserId={loggedInUserId} />
            ))
          )}
          <RealtimeHistory
            loggedInUserId={loggedInUserId}
            scrollToId={scrollToId}
          />
        </li>
      </ul>
      {/* we're using this element to scroll to the latest chat message */}
      <span className="w-0 h-0" id={scrollToId} />
    </section>
  );
}
import { ChatMessage } from "app/_components/ChatMessage";
import { History } from "types/dbEntities";

async function getChatHistoryWithId(userId: number) {
  const result = await fetch(process.env.BACKEND_URL + "/chats/" + userId);
  return JSON.parse(await result.text()) as History[];
}

const loggedInUserId = 177;

export default async function ChatHistory({
  params,
}: {
  params: { name: string[] };
}) {
  if (!("name" in params)) {
    return <section className="flex m-auto">No chat selected</section>;
  }

  const id = +decodeURIComponent(params.name[0]);

  const chatHistory = await getChatHistoryWithId(id);

  return (
    <section className="overflow-y-auto" id="">
      <ul className="flex flex-col space-y-4">
        {chatHistory.length === 0
          ? "No messages yet."
          : chatHistory.map((h) => (
              <li key={h.id}>
                <ChatMessage history={h} />
              </li>
            ))}
        {/* we're using this element to scroll to the latest chat message */}
        <span className="w-0 h-0" id="latest" />
      </ul>
    </section>
  );
}

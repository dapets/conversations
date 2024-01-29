import { ChatMessage } from "app/_components/ChatMessage";
import { sampleChatHistory } from "utils/sampleData";

async function getChatHistoryWithId(userId: number) {
  const result = fetch(process.env.BACKEND_URL + "/chats/" + userId);
}

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

  const authorIdx = sampleChatHistory.findIndex((n) => n.id === name);
  if (authorIdx < 0) return "Invalid Author: error fetching messages";

  return (
    <section className="overflow-y-auto">
      <ul className="flex flex-col space-y-4">
        {sampleChatHistory[authorIdx].messages.map((m, i) => (
          <li key={i}>
            <ChatMessage
              author={sampleChatHistory[authorIdx].author}
              message={m}
              sentOn={new Date(Date.parse(sampleChatHistory[authorIdx].sentOn))}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

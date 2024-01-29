import { ChatMessage } from "app/_components/ChatMessage";
import { sampleChatHistory } from "utils/sampleData";

export default function ChatHistory({
  params,
}: {
  params: { name: string[] };
}) {
  const name = decodeURIComponent(params.name[0]);

  const authorIdx = sampleChatHistory.findIndex((n) => n.author === name);
  if (authorIdx < 0) return "Invalid Author: error fetching messages";

  return (
    <section className="overflow-y-auto">
      <ul>
        {sampleChatHistory[authorIdx].messages.map((m, i) => (
          <li key={i} className="mb-2">
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

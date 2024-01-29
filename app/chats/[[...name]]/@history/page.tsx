import { ChatMessage } from "@components/ChatMessage";
import { sampleChatHistory } from "sampleData";

export default function ChatHistory({ params }: { params: { slug: string } }) {
  console.log(params);
  return (
    <section className="overflow-y-auto">
      <ul>
        {sampleChatHistory[0].messages.map((m, i) => (
          <li key={i} className="mb-2">
            <ChatMessage
              author={sampleChatHistory[0].author}
              message={m}
              sentOn={sampleChatHistory[0].sentOn}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

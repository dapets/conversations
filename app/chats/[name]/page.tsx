import { ChatMessage } from "@components/ChatMessage";
import { sampleChatHistory } from "sampleData";

export default function ChatHistory() {
  return (
    <ul>
      {sampleChatHistory.messages.map((m, i) => (
        <li key={i} className="mb-2">
          <ChatMessage
            author={sampleChatHistory.from}
            message={m.message}
            sentOn={m.date}
          />
        </li>
      ))}
    </ul>
  );
}

import { ChatDescription } from "@components/ChatDescription";
import { sampleUsers } from "sampleData";

export default function SampleDataChatList() {
  return (
    <ul>
      {sampleUsers.map((u, i) => (
        <li key={i}>
          <ChatDescription username={u.username} />
        </li>
      ))}
    </ul>
  );
}

import { ChatDescription } from "@components/ChatDescription";
import { sampleUsers } from "sampleData";

export default function Description() {
  console.log("Description called");
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

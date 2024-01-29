import { PastHistory } from "@components/PastHistory";
import { getChatHistoryWithId } from "utils/dataFetchers";

export default async function ChatHistory({
  params,
}: {
  params: { name: string[] };
}) {
  const id = +decodeURIComponent(params.name[0]);

  const chatHistory = await getChatHistoryWithId(id);

  return (
    <section className="overflow-y-auto p-4 pl-0 pr-14">
      <PastHistory history={chatHistory} />
      {/* we're using this element to scroll to the latest chat message */}
      <span className="w-0 h-0" id="latest" />
    </section>
  );
}

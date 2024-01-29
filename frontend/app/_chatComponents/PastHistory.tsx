import { Message } from "app/_chatComponents/Message";
import { HistoryEntity } from "utils/types/dbEntities";

export function PastHistory({ history }: { history: HistoryEntity[] }) {
  return (
    <ul className="flex flex-col space-y-4">
      {history.length === 0 ? (
        <p className="m-auto">You haven&apost talked yet!</p>
      ) : (
        history.map((h) => (
          <li key={h.id}>
            <Message history={h} />
          </li>
        ))
      )}
    </ul>
  );
}

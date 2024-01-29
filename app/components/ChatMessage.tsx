export function ChatMessage(props: {
  author: string;
  message: string;
  sentOn: string;
}) {
  return (
    <div>
      <div className="flex flex-row items-baseline">
        <h3 className="text-sm font-semibold">{props.author}</h3>
        <span className="text-xs ml-2 text-slate-900">{props.sentOn}</span>
      </div>
      <p className="font-light">{props.message}</p>
    </div>
  );
}

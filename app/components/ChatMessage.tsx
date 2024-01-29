"use client";

import dayjs from "dayjs";
import AdvancedFormat from "dayjs/plugin/relativeTime";

dayjs.extend(AdvancedFormat);

export function ChatMessage(props: {
  author: string;
  message: string;
  sentOn: Date;
}) {
  return (
    <section>
      <div className="mb-1 flex items-baseline">
        <h2 className="text-base font-bold">{props.author}</h2>
        <span className="ml-4 text-sm text-zinc-600">
          {dayjs().to(props.sentOn)}
        </span>
      </div>
      <p>{props.message}</p>
    </section>
  );
}

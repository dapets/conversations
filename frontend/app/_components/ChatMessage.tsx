"use client";

import dayjs from "dayjs";
import AdvancedFormat from "dayjs/plugin/relativeTime";
import { History } from "types/dbEntities";

dayjs.extend(AdvancedFormat);

export function ChatMessage(props: { history: History }) {
  const { author, sentOn, message } = props.history;
  return (
    <section>
      <div className="flex items-baseline">
        <h2 className="text-base font-bold">
          {author.firstName + " " + author.lastName}
        </h2>
        <time className="ml-4 text-sm text-zinc-600" suppressHydrationWarning>
          {dayjs().to(sentOn)}
        </time>
      </div>
      <div className="flex leading-7 max-w-[75%] rounded-lg px-3 py-2 text-sm bg-primary text-primary-foreground">
        {message}
      </div>
    </section>
  );
}

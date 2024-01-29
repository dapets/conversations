"use client";

import { TypographyP } from "@/components/TypographyP";
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
      <div className="flex items-baseline">
        <h2 className="text-base font-bold">{props.author}</h2>
        <time className="ml-4 text-sm text-zinc-600" suppressHydrationWarning>
          {dayjs().to(props.sentOn)}
        </time>
      </div>
      <div className="flex leading-7 max-w-[75%] rounded-lg px-3 py-2 text-sm bg-primary text-primary-foreground">
        {props.message}
      </div>
    </section>
  );
}

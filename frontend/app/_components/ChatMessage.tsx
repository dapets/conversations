import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import AdvancedFormat from "dayjs/plugin/relativeTime";
import { History, User } from "types/dbEntities";

dayjs.extend(AdvancedFormat);

async function getSelf() {
  const result = await fetch(process.env.BACKEND_URL + "/whoami");

  return JSON.parse(await result.text()) as User;
}

export async function ChatMessage(props: { history: History }) {
  const { author, sentOn, message } = props.history;

  const iAm = await getSelf();
  const isAuthor = iAm.id === author.id;

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
      <div
        data-isauthor={isAuthor}
        className={cn(
          "flex leading-7 max-w-[75%] rounded-lg px-3 py-2 ",
          "text-sm bg-accent text-accent-foreground",
          {
            "bg-primary text-primary-foreground": isAuthor,
          }
        )}
      >
        {message}
      </div>
    </section>
  );
}

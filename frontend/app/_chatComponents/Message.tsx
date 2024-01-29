import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import AdvancedFormat from "dayjs/plugin/relativeTime";
import { getLoggedInUser } from "utils/dataFetchers";
import { HistoryEntity } from "utils/types/dbEntities";

dayjs.extend(AdvancedFormat);

export async function Message({ history }: { history: HistoryEntity }) {
  const { author, sentOn, message } = history;

  const loggedInUser = await getLoggedInUser();
  const isAuthor = loggedInUser.id === author.id;

  return (
    <section>
      <div className="flex items-baseline pl-1 pr-1">
        <h2 className={cn("text-base font-bold", { "ml-auto": isAuthor })}>
          {author.firstName + " " + author.lastName}
        </h2>
        <time className="text-sm text-zinc-600 ml-4" suppressHydrationWarning>
          {dayjs().to(sentOn)}
        </time>
      </div>
      <div
        data-isauthor={isAuthor}
        className={cn(
          "flex leading-7 w-fit max-w-[70%] rounded-lg px-3 py-2 ",
          "text-sm bg-accent text-accent-foreground",
          {
            "bg-primary text-primary-foreground ml-auto": isAuthor,
          }
        )}
      >
        {message}
      </div>
    </section>
  );
}

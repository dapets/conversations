import { cn } from "@/lib/utils";
import { HistoryEntity } from "utils/dbEntities";
import { getRelativeLocalTimeStrFromUtcDate } from "utils/configuredDayjs";
import { getUserDisplayName } from "utils/utils";

export function Message({
  history,
  loggedInUserId,
}: {
  history: HistoryEntity;
  loggedInUserId: string;
}) {
  const { author, sentOn, message } = history;

  const isAuthor = loggedInUserId === author.id;

  return (
    <section>
      <div className="flex items-baseline pl-1 pr-1">
        <h2 className={cn("text-base font-bold", { "ml-auto": isAuthor })}>
          {getUserDisplayName(author)}
        </h2>
        <time className="text-sm text-zinc-600 ml-4" suppressHydrationWarning>
          {getRelativeLocalTimeStrFromUtcDate(sentOn)}
        </time>
      </div>
      <p
        data-isauthor={isAuthor}
        className={cn(
          "leading-7 w-fit max-w-[70%] rounded-lg",
          "bg-accent px-3 py-1 ",
          "[overflow-wrap:anywhere] text-accent-foreground",
          {
            "bg-primary text-primary-foreground ml-auto": isAuthor,
          }
        )}
      >
        {message}
      </p>
    </section>
  );
}

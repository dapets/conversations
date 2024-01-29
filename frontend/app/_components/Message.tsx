import { cn } from "@/lib/utils";
import { HistoryEntity } from "utils/dbEntities";
import { getRelativeLocalTimeStrFromUtcDate } from "utils/configuredDayjs";
import { getUserDisplayName, getUserInitials } from "utils/utils";
import { Avatar, AvatarFallback } from "@shadcn/avatar";

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
    <section
      className={cn("flex flex-col p-4 w-fit max-w-[70%] rounded-md", {
        "ml-auto bg-primary text-primary-foreground": isAuthor,
      })}
    >
      <div className="flex items-center space-x-3">
        <Avatar>
          <AvatarFallback>{getUserInitials(author)}</AvatarFallback>
        </Avatar>
        <div>
          <p className={cn("text-sm font-semibold", { "ml-auto": isAuthor })}>
            {getUserDisplayName(author)}
          </p>
          <time className="text-xs text-gray-500 mb-2">
            {getRelativeLocalTimeStrFromUtcDate(sentOn)}
          </time>
        </div>
      </div>
      <p
        data-isauthor={isAuthor}
        className={cn("leading-7 py-1 [overflow-wrap:anywhere]")}
      >
        {message}
      </p>
    </section>
  );
}

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
      className={cn(
        "flex flex-col space-y-2 p-2 w-fit max-w-[70%] rounded-lg",
        {
          "ml-auto justify-end": isAuthor,
        }
      )}
    >
      <div className="flex items-center space-x-3 ">
        <Avatar className={cn({ "order-0": isAuthor })}>
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
        className={cn(
          "leading-7 py-1 px-2 w-fit rounded-md [overflow-wrap:anywhere] bg-accent"
        )}
      >
        {message}
      </p>
    </section>
  );
}

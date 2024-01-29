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
        "grid grid-areas-message items-center gap-y-1 gap-x-2 p-2 w-fit max-w-[70%] rounded-lg",
        {
          "ml-auto justify-items-end": isAuthor,
        }
      )}
    >
      <Avatar
        className={cn("grid-in-avatar", { "grid-in-avatar-author": isAuthor })}
      >
        <AvatarFallback>{getUserInitials(author)}</AvatarFallback>
      </Avatar>
      <p className="grid-in-author text-sm font-semibold">
        {getUserDisplayName(author)}
      </p>
      <p className="grid-in-message leading-7 px-2 w-fit rounded-md [overflow-wrap:anywhere] bg-accent">
        {message}
      </p>
      <time className="grid-in-last-message-date text-xs text-gray-500">
        {getRelativeLocalTimeStrFromUtcDate(sentOn)}
      </time>
    </section>
  );
}

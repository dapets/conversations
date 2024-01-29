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
        "flex items-center gap-4 space-y-2 p-2 w-fit max-w-[70%] rounded-lg",
        {
          "ml-auto justify-end": isAuthor,
        }
      )}
    >
      <Avatar className="w-12 h-12">
        <AvatarFallback>{getUserInitials(author)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-2">
        <div className="text-sm font-semibold">
          {getUserDisplayName(author)}
        </div>
        <p className="leading-7 py-1 px-2 w-fit rounded-md [overflow-wrap:anywhere] bg-accent">
          {message}
        </p>
        <div className="text-xs text-gray-500">
          {getRelativeLocalTimeStrFromUtcDate(sentOn)}
        </div>
      </div>
    </section>
  );
}

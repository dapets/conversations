import { cn } from "@/lib/utils";
import { HistoryEntity } from "utils/projectTypes";
import { getUserDisplayName, getUserInitials } from "utils/utils";
import { Avatar, AvatarFallback } from "@shadcn/avatar";
import { AutoUpdatingRelativeTime } from "./AutoUpdatingRelativeTime";

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
        "grid w-fit max-w-[70%] items-center gap-x-2 gap-y-1 rounded-lg p-2 grid-areas-message",
        {
          "ml-auto justify-items-end": isAuthor,
        },
      )}
    >
      <Avatar
        className={cn("grid-in-avatar", { "grid-in-avatar-author": isAuthor })}
      >
        <AvatarFallback>{getUserInitials(author)}</AvatarFallback>
      </Avatar>
      <p className="text-sm font-semibold grid-in-author">
        {getUserDisplayName(author)}
      </p>
      <p
        className={cn(
          "w-fit rounded-md bg-accent px-2 leading-7 grid-in-message [overflow-wrap:anywhere]",
          { "bg-primary text-primary-foreground": isAuthor },
        )}
      >
        {message}
      </p>
      <AutoUpdatingRelativeTime
        date={sentOn}
        className="text-xs text-gray-500 grid-in-last-message-date"
      />
    </section>
  );
}

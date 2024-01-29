import { cn } from "@/lib/utils";

export function MessageInput({ className }: { className?: string }) {
  return (
    <input
      className={cn(
        //all these focus-visible: can't be omitted or combined because firefox
        "rounded-lg p-2 focus-visible:outline focus:outline-2 focus-visible:outline-primary focus-visible:border-transparent border-secondary border-2",
        className
      )}
      type="text"
      placeholder="Type a message..."
    />
  );
}

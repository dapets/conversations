import { cn } from "@/lib/utils";

export function TypographyLarge({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("text-base font-semibold", className)}>{children}</div>
  );
}

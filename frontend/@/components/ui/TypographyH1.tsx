import { cn } from "@/lib/utils";

export function TypographyH1({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <h1 className={cn("text-2xl", className)}>{children}</h1>;
}

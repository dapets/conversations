import type { Metadata } from "next";
import "./globals.css";
import SignalRProvider from "@providers/SignalRProvider";
import { Suspense } from "react";
import { TooltipProvider } from "@shadcn/tooltip";

export const metadata: Metadata = {
  title: "Conversations",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Suspense>
          <TooltipProvider delayDuration={500}>
            <SignalRProvider>{children}</SignalRProvider>
          </TooltipProvider>
        </Suspense>
      </body>
    </html>
  );
}

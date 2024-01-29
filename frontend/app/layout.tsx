import type { Metadata } from "next";
import "./globals.css";
import { Suspense } from "react";
import { TooltipProvider } from "@shadcn/tooltip";
import SignalRProvider from "@providers/SignalRProvider";

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
            <SignalRProvider>
              <div className="grid h-[100dvh] w-[100dvw] grid-rows-[minmax(0,auto),minmax(0,1fr)]">
                {process.env.IS_TEST_INSTANCE && (
                  <p className="text-md m-2 rounded-lg bg-accent p-2 text-center font-mono font-medium leading-3">
                    This is a test instance. The database resets every hour.
                  </p>
                )}
                {children}
              </div>
            </SignalRProvider>
          </TooltipProvider>
        </Suspense>
      </body>
    </html>
  );
}

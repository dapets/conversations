import type { Metadata } from "next";
import "./globals.css";
import { Suspense } from "react";
import { TooltipProvider } from "@shadcn/tooltip";
import dynamic from "next/dynamic";

const SignalRProvider = dynamic(() => import("@providers/SignalRProvider"), {
  ssr: false,
});

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

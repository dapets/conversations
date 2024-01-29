import type { Metadata } from "next";
import "./globals.css";
import { GeistSans } from "geist/font";
import SignalRProvider from "@components/SignalRProvider";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className}>
        <SignalRProvider>{children}</SignalRProvider>
      </body>
    </html>
  );
}

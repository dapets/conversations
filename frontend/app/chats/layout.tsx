import React from "react";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex h-screen w-screen">{children}</div>;
}

import React from "react";

export default async function ClientLayout({
  children,
  ChatList,
}: {
  children: React.ReactNode;
  ChatList: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen">
      <nav className="p-4 overflow-y-auto md:w-64 md:block hidden">
        {ChatList}
      </nav>
      {children}
    </div>
  );
}

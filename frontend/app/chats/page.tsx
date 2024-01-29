"use client";

/** If this is not a client component it sometimes
 * shows up when navigating between chats. Very weird.*/
export default function NoChatSelected() {
  return <p className="row-start-2 place-self-center">No chat selected</p>;
}

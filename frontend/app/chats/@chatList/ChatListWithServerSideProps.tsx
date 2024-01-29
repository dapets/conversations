"use client";

import { ChatRoomDescription } from "@components/ChatRoomDescription";
import ChatRoomDescriptionList from "@components/ChatRoomDescriptionList";
import { ChatRoomListEntity } from "utils/dbEntities";

/**This component exists because we need to pass in render props but want to fetch data on the server.
 * Because functions (render props) cannot be passed from server to client we use this wrapper.
 */
export function ChatListWithServerSideProps({
  chatRooms,
  loggedInUserId,
}: {
  chatRooms: ChatRoomListEntity[];
  loggedInUserId: string;
}) {
  return (
    <ChatRoomDescriptionList
      chatRooms={chatRooms}
      renderChatRoomDescription={(chatRoom, isActive) => (
        <ChatRoomDescription
          loggedInUserId={loggedInUserId}
          chatRoom={chatRoom}
          isActive={isActive}
        />
      )}
    />
  );
}

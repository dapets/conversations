"use client";

import { Message } from "@components/Message";
import { RealtimeHistory } from "@components/RealTimeHistory";
import { ChatRoomEntity } from "utils/dbEntities";

export function RealTimeHistoryWithServerSideProps({
  activeChatRoom,
  scrollToId,
  loggedInUserId,
}: {
  activeChatRoom: ChatRoomEntity;
  scrollToId: string;
  loggedInUserId: string;
}) {
  return (
    <RealtimeHistory
      activeChatRoom={activeChatRoom}
      scrollToId={scrollToId}
      renderMessage={(history) => (
        <li key={history.id}>
          <Message history={history} loggedInUserId={loggedInUserId} />
        </li>
      )}
    />
  );
}

"use client";

import { Message } from "@components/Message";
import { RealtimeHistory } from "@components/RealTimeHistory";

export function RealTimeHistoryWithServerSideProps({
  activeChatRoomId,
  doesRoomHaveMessages,
  scrollToId,
  loggedInUserId,
}: {
  activeChatRoomId: number;
  doesRoomHaveMessages: boolean;
  scrollToId: string;
  loggedInUserId: string;
}) {
  return (
    <RealtimeHistory
      activeChatRoomId={activeChatRoomId}
      doesRoomHaveMessages={doesRoomHaveMessages}
      scrollToId={scrollToId}
      renderMessage={(history) => (
        <li key={history.id}>
          <Message history={history} loggedInUserId={loggedInUserId} />
        </li>
      )}
    />
  );
}

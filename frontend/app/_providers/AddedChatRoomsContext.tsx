"use client";

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import { ChatRoomListEntity } from "utils/projectTypes";

export type AddedChatRooms = {
  addedRooms: ChatRoomListEntity[];
  setAddedRooms: Dispatch<SetStateAction<ChatRoomListEntity[]>>;
};

export const AddedChatRoomsContext = createContext<AddedChatRooms | null>(null);

/**We need this to add chat rooms without re-fetching everything. */
export function ChatRoomsProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value?: ChatRoomListEntity[];
}) {
  const [addedRooms, setAddedRooms] = useState<ChatRoomListEntity[]>(
    value ?? [],
  );

  return (
    <AddedChatRoomsContext.Provider
      value={{
        addedRooms,
        setAddedRooms,
      }}
    >
      {children}
    </AddedChatRoomsContext.Provider>
  );
}

function useChatRoomsContext() {
  const addedChatRoomsContext = useContext(AddedChatRoomsContext);

  return addedChatRoomsContext;
}

export function useChatRooms() {
  return useChatRoomsContext()?.addedRooms;
}

export function useSetChatRooms() {
  return useChatRoomsContext()?.setAddedRooms;
}

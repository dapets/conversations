"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { ChatRoomListEntity } from "utils/dbEntities";

export type AddedChatRooms = {
  addedRooms: ChatRoomListEntity[];
  addRoom: (addRoom: ChatRoomListEntity) => void;
};

export const AddedChatRoomsContext = createContext<AddedChatRooms | null>(null);

export function AddedChatRoomsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [addedRooms, setAddedRooms] = useState<ChatRoomListEntity[]>([]);
  const addRoom = useCallback(
    (room: ChatRoomListEntity) => setAddedRooms((value) => [room, ...value]),
    [],
  );

  return (
    <AddedChatRoomsContext.Provider
      value={{
        addedRooms,
        addRoom,
      }}
    >
      {children}
    </AddedChatRoomsContext.Provider>
  );
}

function useAddedChatRoomsContext() {
  const addedChatRoomsContext = useContext(AddedChatRoomsContext);
  if (!addedChatRoomsContext) {
    throw new Error("Tried using AddedChatRoomsContext when it was null");
  }

  return addedChatRoomsContext;
}

export function useAddedRooms() {
  return useAddedChatRoomsContext().addedRooms;
}

export function useAddSingleRoom() {
  return useAddedChatRoomsContext().addRoom;
}

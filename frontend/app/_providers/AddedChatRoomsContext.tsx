"use client";

import { createContext, useContext, useState } from "react";
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

  return (
    <AddedChatRoomsContext.Provider
      value={{
        addedRooms,
        addRoom: (room) => setAddedRooms((value) => [room, ...value]),
      }}
    >
      {children}
    </AddedChatRoomsContext.Provider>
  );
}

export function useAddedChatRooms() {
  const addedChatRoomsContext = useContext(AddedChatRoomsContext);
  if (!addedChatRoomsContext) {
    throw new Error("Tried using AddedChatRoomsContext when it was null");
  }

  return addedChatRoomsContext;
}

export function useAddedRooms() {
  return useAddedChatRooms().addedRooms;
}

export function useAddSingleRoom() {
  return useAddedChatRooms().addRoom;
}

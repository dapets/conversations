export type UserEntity = {
  id: string;
  firstName: string;
  lastName: string;
};

export type HistoryEntity = {
  id: number;
  sentOn: Date;
  message: string;
  author: UserEntity;
};

export type ChatRoomEntity = {
  id: number;
  members: UserEntity[];
  history: HistoryEntity[];
};

export type ChatRoomListEntity = Exclude<ChatRoomEntity, "history"> & {
  lastMessage?: HistoryEntity;
};

export type UserEntity = {
  id: string;
  firstName: string;
  lastName: string;
};

export type HistoryEntity = {
  id: number;
  sentOn: string;
  message: string;
  author: UserEntity;
};

export type ChatRoomEntity = {
  id: number;
  members: UserEntity[];
  history: HistoryEntity[];
  isUnread?: boolean;
};

export type ChatRoomListEntity = Omit<ChatRoomEntity, "history"> & {
  lastMessage?: HistoryEntity;
};

export type ChatRoomCreatedDto = {
  id: number;
  members: UserEntity[];
};

export type RegisterRequest = {
  password: string;
  email: string;
};

export type RegisterResponse = {
  status: number;
  errors: Record<string, string[]>;
};

export type ProblemDetail = {
  status: number;
  detail: string;
};

export type ApiResponse<T> = {
  ok: boolean;
  result?: ProblemDetail | T;
};

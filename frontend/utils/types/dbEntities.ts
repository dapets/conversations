export type UserEntity = {
  id: number;
  firstName: string;
  lastName: string;
};

export type HistoryEntity = {
  id: number;
  sentOn: Date;
  message: string;
  author: UserEntity;
};

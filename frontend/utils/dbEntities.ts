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

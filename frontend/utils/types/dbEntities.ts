export type User = {
  id: number;
  firstName: string;
  lastName: string;
};

export type History = {
  id: number;
  sentOn: Date;
  message: string;
  author: User;
};

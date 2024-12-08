import { MovieDetailed } from './movie';

export type Room = {
  status: string;
  timeCode: number;
  movie: MovieDetailed;
};

export type Action = {
  name: string;
  time_code?: number;
  message?: MessageData;
  username?: string;
};

export type MessageData = {
  text: string;
  sender: string;
  avatar: string;
};

import { MovieDetailed } from './movie';

export type Room = {
  status: string;
  timeCode: number;
  movie: MovieDetailed;
  currentSeason?: number;
  currentSeries?: number;
};

export type Action = {
  name: string;
  time_code?: number;
  message?: MessageData;
  username?: string;
  movie_id?: number;
  season?: number;
  series?: number;
  duration?: number;
};

export type MessageData = {
  text: string;
  sender: string;
  avatar: string;
};

import { MovieDetailed } from './movie';

export type Room = {
  title: string;
  movie: MovieDetailed;
};

export type Action = {
  name: string;
  time_code?: number;
};

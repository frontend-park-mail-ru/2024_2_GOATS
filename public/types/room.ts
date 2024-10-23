import { MovieDetailed } from './movie';

export type Room = {
  status: string;
  time_code: number;
  movie: MovieDetailed;
};

export type Action = {
  name: string;
  time_code?: number;
};

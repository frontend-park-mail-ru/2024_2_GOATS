import { MovieDetailed } from './movie';

export type Room = {
  title: string;
  movie: MovieDetailed;
};

export type Action = {
  name: string;
  timeCode?: number;
};

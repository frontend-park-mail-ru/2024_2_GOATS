import { Movie, MovieSelection } from './movie';

export type ActorInfo = {
  id: number;
  fullName: string;
  biography: string;
  birthdate: string;
  country: string;
  image: string;
};

export type Actor = ActorInfo & {
  movies: Movie[];
};

export type PersonCardData = {
  id: number;
  name: string;
  image: string;
  country: string;
};

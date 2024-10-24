import { Movie, MovieSelection } from './movie';

// Тестовый тип, на время разработки страницы актера. Сделал чтобы работать с movies из consts

export type ActorInfo = {
  id: number;
  name: string;
  career: string;
  birth_date: string; //Date
  born_place: string;
  genres: string;
  image: string;
  biography: string;
};

export type Actor = ActorInfo & {
  movies: Movie[];
};

export type ActorCard = {
  id: number;
  name: string;
  image: string;
  country: string;
};

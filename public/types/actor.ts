import { Movie, MovieSelection } from './movie';

// Тестовый тип, на время разработки страницы актера. Сделал чтобы работать с movies из consts

export type ActorInfo = {
  id: number;
  fullName: string;
  biography: string;
  birthdate: string; //Date
  country: string;
  image: string;

  // career: string;
  // born_place: string;
  // genres: string;
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

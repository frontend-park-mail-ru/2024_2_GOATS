import { PersonCardData } from './actor';

export type Movie = {
  id: number;
  title: string;
  description: string;
  cardImage: string;
  albumImage: string;
  rating: number;
  releaseDate: string;
  movieType: string;
  country: string;
};

export type MovieSelection = {
  id: number;
  title: string;
  movies: Movie[];
};

export type MovieDetailed = {
  id: number;
  title: string;
  titleImage: string;
  shortDescription: string;
  longDescription: string;
  albumImage: string;
  cardImage: string;
  rating: number;
  releaseDate: string;
  country: string;
  isSerial: boolean;
  video: string;
  actors: PersonCardData[];
  director: string;
  seasons?: Season[];
  isFromFavorites?: boolean;
  withSubscription?: boolean;
  //For rating test
  userRating?: number;
};

export type Episode = {
  id: number;
  episodeNumber: number;
  preview: string;
  video: string;
  title?: string;
  description?: string;
  releaseDate?: string;
  rating?: number;
};

export type Season = {
  seasonNumber: number;
  episodes: Episode[];
};

export type Person = {
  id: number;
  name: string;
  image: string;
  isDirector: boolean;
};

export type MovieSaved = {
  id: number;
  title: string;
  albumImage: string;
  timeCode: number;
  duration: number;
  season?: number;
  series?: number;
  savingSeconds: number;
};

export type SeasonsNumber = {
  number: number;
  isActive: boolean;
};

export type Movie = {
  id: number;
  title: string;
  description: string;
  cardImage: string;
  albumImage: string;
  rating: number;
  releaseDate: Date;
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
  image: string;
  rating: number;
  releaseDate: string; // TODO: поменять на Date
  country: string;
  director: string;
  isSerial: boolean;
};

export type Series = {
  id: number;
  position: number;
  image: string;
  title: string;
};

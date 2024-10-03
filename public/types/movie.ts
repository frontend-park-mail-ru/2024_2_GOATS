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

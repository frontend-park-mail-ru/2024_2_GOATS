export const serializeMovie = (movie) => {
  return {
    id: movie.id,
    title: movie.title,
    albumImage: 'http://185.241.195.151/' + movie.album_image,
    cardImage: 'http://185.241.195.151/' + movie.card_image,
    country: movie.country,
    description: movie.description,
    movieType: movie.movie_type,
    rating: movie.rating,
    releaseDate: movie.release_date,
  };
};

export const serializeCollections = (collections) => {
  return collections.map((collection) => ({
    id: collection.id,
    title: collection.title,
    movies: collection.movies.map(serializeMovie),
  }));
};

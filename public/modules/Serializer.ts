import { dateFormatter } from './DateFormatter';

export const serializeMovie = (movie: any) => {
  return {
    id: movie.id,
    title: movie.title,
    albumImage: 'http://185.241.195.151/' + movie.album_url,
    cardImage: 'http://185.241.195.151/' + movie.card_url,
    country: movie.country,
    description: movie.description,
    movieType: movie.movie_type,
    rating: movie.rating,
    releaseDate: movie.release_date,
  };
};

export const serializeCollections = (collections: any) => {
  return collections.map((collection: any) => ({
    id: collection.id,
    title: collection.title,
    movies: collection.movies.map(serializeMovie),
  }));
};

export const serializePersonCard = (person: any) => {
  return {
    id: person.id,
    name: person.full_name,
    image: 'http://185.241.195.151/' + person.photo_url,
    country: person.country,
  };
};

export const serializePersonCards = (persons: any) => {
  return persons.map((person: any) => {
    return serializePersonCard(person);
  });
};

export const serializeMovieDetailed = (movie: any) => {
  return {
    id: movie.id,
    title: movie.title,
    titleImage: 'http://185.241.195.151/' + movie.title_url,
    longDescription: movie.full_description,
    shortDescription: movie.short_description,
    albumImage: 'http://185.241.195.151/' + movie.album_url,
    cardImage: 'http://185.241.195.151/' + movie.card_url,
    rating: movie.rating,
    releaseDate: dateFormatter(movie.release_date),
    country: movie.country,
    isSerial: movie.movie_type === 'serial',
    video: 'http://185.241.195.151/' + movie.video_url,
    actors: serializePersonCards(movie.actors_info),
    director: movie.director,
  };
};

export const serializeActorData = (actor: any) => {
  return {
    id: actor.id,
    fullName: actor.full_name,
    biography: actor.biography,
    birthdate: actor.birthdate,
    country: actor.country,
    image: 'http://185.241.195.151/' + actor.photo_url,
  };
};

export const serializeUserData = (user: any) => {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    birthdate: user.birthdate,
    sex: user.sex,
    avatar: 'http://185.241.195.151' + user.avatar_url,
  };
};

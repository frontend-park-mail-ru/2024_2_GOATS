import { dateFormatter } from './DateFormatter';
import { HOST } from '../consts';
import { Episode, Season } from 'types/movie';

export const serializeMovie = (movie: any) => {
  return {
    id: movie.id,
    title: movie.title,
    albumImage: HOST + movie.album_url,
    cardImage: HOST + movie.card_url,
    country: movie.country,
    description: movie.description,
    movieType: movie.movie_type,
    rating: movie.rating,
    releaseDate: dateFormatter(movie.release_date),
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
    image: HOST + person.photo_url,
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
    titleImage: HOST + movie.title_url,
    longDescription: movie.full_description,
    shortDescription: movie.short_description,
    albumImage: HOST + movie.album_url,
    cardImage: HOST + movie.card_url,
    rating: movie.rating,
    releaseDate: dateFormatter(movie.release_date),
    country: movie.country,
    isSerial: movie.movie_type === 'serial',
    video: HOST + movie.video_url,
    actors: movie.actors_info
      ? serializePersonCards(movie.actors_info)
      : undefined,
    director: movie.director ? movie.director : undefined,
    seasons:
      movie.seasons &&
      movie.seasons.map(serializeSeason).sort((a: Season, b: Season) => {
        return a.seasonNumber - b.seasonNumber;
      }),
    isFromFavorites: movie.is_favorite,
    withSubscription: !!movie.with_subscription,
    //For rating test
    userRating: 7,
  };
};

export const serializeEpisode = (episode: any) => {
  return {
    id: episode.id,
    episodeNumber: episode.episode_number,
    preview: HOST + episode.preview_url,
    video: HOST + episode.video_url,
    title: episode.title,
    description: episode.description,
    releaseDate: episode.release_date,
    rating: episode.rating,
  };
};

export const serializeSeason = (season: any) => {
  return {
    seasonNumber: season.season_number,
    episodes: season.episodes
      .map(serializeEpisode)
      .sort((a: Episode, b: Episode) => {
        return a.episodeNumber - b.episodeNumber;
      }),
  };
};

export const serializeActorData = (actor: any) => {
  return {
    id: actor.id,
    fullName: actor.full_name,
    biography: actor.biography,
    birthdate: actor.birthdate,
    country: actor.country,
    image: HOST + actor.photo_url,
    movies: actor.movies.map(serializeMovie),
  };
};

export const serializeSearchActorData = (actor: any) => {
  return {
    id: actor.id,
    fullName: actor.full_name,
    birthdate: actor.birthdate,
    country: actor.country,
    image: HOST + actor.photo_url,
  };
};

export const serializeUserData = (user: any) => {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    birthdate: user.birthdate,
    sex: user.sex,
    avatar: HOST + user.avatar_url,
    isPremium: user.subscription_status,
    expirationDate: user.subscription_expiration_date,
  };
};

export const serializeRoom = (room: any) => {
  return {
    id: room.id,
    movie: serializeMovieDetailed(room.movie),
    status: room.status,
    timeCode: room.time_code,
  };
};

export const serializeSavedMovie = (savedMovie: any) => {
  return {
    id: savedMovie.id,
    title: savedMovie.title,
    albumImage: savedMovie.album_url,
    timeCode: savedMovie.timecode,
    duration: savedMovie.duration,
    savingSeconds: savedMovie.saving_seconds,
    ...(savedMovie.season && { season: savedMovie.season }),
    ...(savedMovie.series && { series: savedMovie.series }),
  };
};

export const serializeSavedMovies = (savedMovies: any) => {
  return savedMovies.map((savedMovie: any) => {
    return serializeSavedMovie(savedMovie);
  });
};

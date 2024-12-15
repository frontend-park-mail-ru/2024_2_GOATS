import { dispatcher } from 'flux/Dispatcher';
import { ActionTypes } from 'flux/ActionTypes';
import { MoviePage } from 'pages/MoviePage/MoviePage';
import { apiClient } from 'modules/ApiClient';
import { MovieDetailed, MovieSaved, MovieSelection } from 'types/movie';
import { Emitter } from 'modules/Emmiter';
import {
  serializeMovieDetailed,
  serializeSavedMovies,
} from 'modules/Serializer';
import {
  deserializeSavedMovie,
  deserializeSavedMovies,
} from 'modules/Deserializer';
import { userStore } from './UserStore';
import { ErrorPage } from 'pages/ErrorPage/ErrorPage';
import { Notifier } from 'components/Notifier/Notifier';
import { UsersList } from 'components/UsersList/UsersList';

const moviePage = new MoviePage();

class MoviePageStore {
  #movie!: MovieDetailed | null;
  #movieSelections: MovieSelection[] = [];
  #lastMovies: MovieSaved[] = [];
  #hasMovieGot: Emitter<boolean>;
  #hasTimeCodeChangedEmitter: Emitter<boolean>;

  constructor() {
    this.#hasMovieGot = new Emitter<boolean>(false);
    this.#hasTimeCodeChangedEmitter = new Emitter<boolean>(false);

    const unsubscribeLastMovies = this.hasTimeCodeChangedEmitter$.addListener(
      (status) => {
        if (status) {
          moviePage.setStartTimecode();
        }
      },
    );

    const unsubscribeMovie = this.hasMovieGotEmitter$.addListener((status) => {
      if (status) {
        moviePage.renderMovieDescription();
      }
    });

    this.ngOnLastMoviesDestroy = () => {
      unsubscribeLastMovies();
    };

    this.ngOnMovieDestroy = () => {
      unsubscribeMovie();
    };

    dispatcher.register(this.reduce.bind(this));
  }

  ngOnLastMoviesDestroy(): void {}
  ngOnMovieDestroy(): void {}

  get hasMovieGotEmitter$(): Emitter<boolean> {
    return this.#hasMovieGot;
  }

  get hasTimeCodeChangedEmitter$(): Emitter<boolean> {
    return this.#hasTimeCodeChangedEmitter;
  }

  setMovieState(movie: MovieDetailed) {
    this.#movie = movie;
  }

  setSelectionsState(movieSelections: MovieSelection[]) {
    this.#movieSelections = movieSelections;
  }

  getMovie() {
    return this.#movie;
  }

  getSelections() {
    return this.#movieSelections;
  }

  getLastMovies() {
    return this.#lastMovies;
  }

  async getMovieRequest(id: number) {
    this.#hasMovieGot.set(false);
    try {
      const response = await apiClient.get({
        path: `movies/${id}`,
      });

      // TODO: Убрать мок
      if (
        response.movie_info.title === 'Игра в кальмара' ||
        response.movie_info.title === 'Бумажный дом'
      ) {
        response.movie_info.movie_type = 'movie';
      }
      // response.movie_info.video_url =
      //   '/static/movies_all/how-you-see-me/movie.mp4';
      const serializedMovieData = serializeMovieDetailed(response.movie_info);
      this.setMovieState(serializedMovieData);
    } catch (error) {
      throw error;
      // const errorPage = new ErrorPage({
      //   errorTitle: '404. Страница не найдена',
      //   errorDescription:
      //     'Возможно, вы воспользовались недействительной ссылкой или страница была удалена. Проверьте URL-адрес или перейдите на главную страницу, там вас ожидают лучшие фильмы и сериалы.',
      // });
      // errorPage.render();
    } finally {
      this.#hasMovieGot.set(true);
    }
  }

  getLastMoviesFromLocalStorage() {
    try {
      const moviesString = localStorage.getItem('last_movies');
      if (moviesString) {
        this.#lastMovies = JSON.parse(moviesString);
      } else {
        this.#lastMovies = [];
      }
    } catch (e) {
      this.#lastMovies = [];
      throw e;
    }
  }

  async getLastMoviesRequest() {
    try {
      const response = await apiClient.get({
        path: `users/${userStore.getUser().id}/watched`,
      });

      this.#lastMovies = serializeSavedMovies(response.watched_movies);
    } catch (e) {
      throw e;
    }
  }

  setLastMoviesRequest(savedMovie?: MovieSaved) {
    apiClient.post({
      path: `users/${userStore.getUser().id}/watched`,
      ...(savedMovie
        ? { body: { watched_movies: [deserializeSavedMovie(savedMovie)] } }
        : {
            body: {
              watched_movies: deserializeSavedMovies(this.#lastMovies),
            },
          }),
    });
  }

  deleteLastMovieRequest() {
    apiClient.delete({
      path: `users/${userStore.getUser().id}/watched`,
      body: {
        movie_id: this.#movie?.id,
      },
    });
  }

  setLastMoviesToLocalStorage(
    timeCode: number,
    duration: number,
    season?: number,
    series?: number,
  ) {
    const foundMovie = this.#lastMovies.find((m) => m.id === this.#movie?.id);
    if (this.#movie) {
      if (this.#movie?.isSerial) {
        const seriesImage = this.#movie.seasons
          ?.find((seasonObject) => seasonObject.seasonNumber === season)
          ?.episodes.find(
            (episode) => episode.episodeNumber === series,
          )?.preview;

        if (foundMovie) {
          foundMovie.timeCode = timeCode;
          foundMovie.season = season;
          foundMovie.series = series;
          foundMovie.albumImage = seriesImage as string;
        } else {
          this.#lastMovies.push({
            id: this.#movie.id,
            title: this.#movie.title,
            albumImage: seriesImage as string,
            timeCode: timeCode,
            duration: duration,
            season: season,
            series: series,
            savingSeconds: Date.now(),
          });
        }
      } else {
        if (foundMovie) {
          foundMovie.timeCode = timeCode;
          foundMovie.savingSeconds = Date.now();
        } else {
          this.#lastMovies.push({
            id: this.#movie.id,
            title: this.#movie.title,
            albumImage: this.#movie.albumImage,
            timeCode: timeCode,
            duration: duration,
            savingSeconds: Date.now(),
          });
        }
      }

      this.#lastMovies.sort((a, b) => b.savingSeconds - a.savingSeconds);

      if (this.#lastMovies.length > 5) {
        this.#lastMovies.pop();
      }

      try {
        localStorage.setItem('last_movies', JSON.stringify(this.#lastMovies));
      } catch (e) {
        throw e;
      } finally {
        this.#hasTimeCodeChangedEmitter.set(true);
      }
    }
  }

  deleteLastMovieFromLocalStorage() {
    this.#hasTimeCodeChangedEmitter.set(false);
    try {
      const filteredLastMovies = this.#lastMovies.filter(
        (movie: MovieSaved) => {
          return movie.id !== this.#movie?.id;
        },
      );

      localStorage.setItem('last_movies', JSON.stringify(filteredLastMovies));
      this.#lastMovies = filteredLastMovies;
    } catch (e) {
      throw e;
    } finally {
      this.#hasTimeCodeChangedEmitter.set(true);
    }
  }

  async rateMovieRequest(rating: number) {
    const tmp = this.#movie?.userRating;
    try {
      if (this.#movie?.userRating !== undefined) {
        this.#movie.userRating = rating;
      }
      await apiClient.post({
        path: `movies/${this.#movie?.id}/rating`,
        body: { rating: rating },
      });
      if (this.#movie?.userRating !== undefined) {
        this.#movie.userRating = rating;
      }
    } catch (e) {
      if (this.#movie?.userRating !== undefined) {
        this.#movie.userRating = tmp;
      }
      const not = new Notifier('error', 'Что-то пошло не так', 2000);
      not.render();
    }
  }

  // не удалять
  async deleteRatingRequest() {
    try {
      const response = await apiClient.delete({
        path: `movies/${this.#movie?.id}/rating`,
      });
      if (this.#movie?.userRating) {
        this.#movie.userRating = 0;
      }
    } catch (e) {}
  }

  async reduce(action: any) {
    switch (action.type) {
      case ActionTypes.RENDER_MOVIE_PAGE:
        this.#movie = null;
        moviePage.render();
        await this.getMovieRequest(action.payload.id);
        if (!userStore.isUserLoadingEmmiter$.get()) {
          if (userStore.getUser().username) {
            // TODO: Расскомментировать после мержа
            // await this.getLastMoviesRequest();
          } else {
            this.getLastMoviesFromLocalStorage();
          }
        }
        // this.getLastMoviesFromLocalStorage();
        moviePage.render(
          action.payload.fromRecentlyWatched,
          action.payload.receivedSeason,
          action.payload.receivedSeries,
        );
        break;
      case ActionTypes.GET_MOVIE:
        await this.getMovieRequest(action.payload);
        break;
      case ActionTypes.GET_LAST_MOVIES:
        if (
          !userStore.isUserLoadingEmmiter$.get() &&
          !userStore.getUser().username
        ) {
          this.getLastMoviesFromLocalStorage();
        }
        break;
      case ActionTypes.SET_LAST_MOVIES:
        if (userStore.getUser().username) {
          // TODO: Расскомментировать после мержа
          // this.setLastMoviesRequest({
          //   ...action.payload,
          //   id: this.#movie?.id,
          //   title: this.#movie?.title,
          //   albumImage: this.#movie?.albumImage,
          //   savingSeconds: Date.now(),
          // });
        } else {
          this.setLastMoviesToLocalStorage(
            action.payload.timeCode,
            action.payload.duration,
            action.payload.season,
            action.payload.series,
          );
        }
        break;
      case ActionTypes.COPY_LAST_MOVIES:
        // TODO: Расскомментировать после мержа
        // this.setLastMoviesRequest();
        break;
      case ActionTypes.DELETE_LAST_MOVIE:
        if (userStore.getUser().username) {
          // TODO: Расскомментировать после мержа
          // this.deleteLastMovieRequest();
        } else {
          this.deleteLastMovieFromLocalStorage();
        }
        break;
      case ActionTypes.RATE_MOVIE:
        this.rateMovieRequest(action.payload.rating);
        break;
      case ActionTypes.DELETE_RATING:
        this.deleteRatingRequest();
        break;
      default:
        break;
    }
  }
}

export const moviePageStore = new MoviePageStore();

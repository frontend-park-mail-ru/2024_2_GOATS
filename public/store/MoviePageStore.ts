import { dispatcher } from 'flux/Dispatcher';
import { ActionTypes } from 'flux/ActionTypes';
import { MoviePage } from 'pages/MoviePage/MoviePage';
import { apiClient } from 'modules/ApiClient';
import { MovieDetailed, MovieSaved, MovieSelection } from 'types/movie';
import { Emitter } from 'modules/Emmiter';
import {
  serializeMovieDetailed,
  serializeCollections,
} from 'modules/Serializer';

const moviePage = new MoviePage();

class MoviePageStore {
  #movie!: MovieDetailed | null;
  #movieSelections: MovieSelection[] = [];
  #isNewSeriesReceivedEmitter: Emitter<boolean>;
  #lastMovies: MovieSaved[] = [];

  #hasTimeCodeChangedEmitter: Emitter<boolean>;

  constructor() {
    this.#isNewSeriesReceivedEmitter = new Emitter<boolean>(false);
    this.#hasTimeCodeChangedEmitter = new Emitter<boolean>(false);

    dispatcher.register(this.reduce.bind(this));
  }

  get isNewSeriesReceivedEmitter$(): Emitter<boolean> {
    return this.#isNewSeriesReceivedEmitter;
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

  async getCollection() {
    const response = await apiClient.get({
      path: 'movie_collections/',
    });

    const serializedSelections = serializeCollections(
      response.collections,
    ).sort((selection1: any, selection2: any) => selection1.id - selection2.id);

    if (serializedSelections.length !== this.#movieSelections.length) {
      this.setSelectionsState(serializedSelections);
    } else {
      this.setSelectionsState(serializedSelections);
    }
  }

  async getMovieRequest(id: number) {
    this.#isNewSeriesReceivedEmitter.set(false);
    const response = await apiClient.get({
      path: `movies/${id}`,
    });

    const serializedMovieData = serializeMovieDetailed(response.movie_info);
    this.setMovieState(serializedMovieData);
    this.#isNewSeriesReceivedEmitter.set(true);
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

  setLastMoviesToLocalStorage(timeCode: number) {
    const foundMovie = this.#lastMovies.find((m) => m.id === this.#movie?.id);
    this.#hasTimeCodeChangedEmitter.set(false);

    if (this.#movie) {
      if (foundMovie) {
        foundMovie.timeCode = timeCode;
      } else {
        this.#lastMovies.push({
          id: this.#movie.id,
          title: this.#movie.title,
          albumImage: this.#movie.albumImage,
          timeCode: timeCode,
        });
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

  async reduce(action: any) {
    switch (action.type) {
      case ActionTypes.RENDER_MOVIE_PAGE:
        this.#movie = null;
        moviePage.render();
        await Promise.all([
          this.getCollection(),
          this.getMovieRequest(action.payload),
        ]);
        this.getLastMoviesFromLocalStorage();
        moviePage.render();
        break;
      case ActionTypes.CHANGE_SERIES:
        await this.getMovieRequest(action.payload);
        break;
      case ActionTypes.GET_LAST_MOVIES:
        this.getLastMoviesFromLocalStorage();
        break;
      case ActionTypes.SET_LAST_MOVIES:
        this.setLastMoviesToLocalStorage(action.timeCode);
        break;
      case ActionTypes.DELETE_LAST_MOVIE:
        this.deleteLastMovieFromLocalStorage();
        break;
      default:
        break;
    }
  }
}

export const moviePageStore = new MoviePageStore();

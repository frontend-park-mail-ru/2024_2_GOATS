import { dispatcher } from 'flux/Dispatcher';
import { ActionTypes } from 'flux/ActionTypes';
import { MoviePage } from 'pages/MoviePage/MoviePage';
import { apiClient } from 'modules/ApiClient';
import { MovieDetailed, MovieSelection } from 'types/movie';
import { Emitter } from 'modules/Emmiter';
import {
  serializeMovieDetailed,
  serializeCollections,
} from 'modules/Serializer';

const moviePage = new MoviePage();

class MoviePageStore {
  #movie!: MovieDetailed;
  #movieSelections: MovieSelection[] = [];
  #isNewSeriesReceivedEmitter: Emitter<boolean>;

  constructor() {
    this.#isNewSeriesReceivedEmitter = new Emitter<boolean>(false);
    dispatcher.register(this.reduce.bind(this));
  }

  get isNewSeriesReceivedEmitter$(): Emitter<boolean> {
    return this.#isNewSeriesReceivedEmitter;
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

  async reduce(action: any) {
    switch (action.type) {
      case ActionTypes.RENDER_MOVIE_PAGE:
        moviePage.render();
        await Promise.all([
          this.getCollection(),
          this.getMovieRequest(action.payload),
        ]);
        moviePage.render();
        break;
      case ActionTypes.CHANGE_SERIES:
        await this.getMovieRequest(action.payload);
        break;
      default:
        break;
    }
  }
}

export const moviePageStore = new MoviePageStore();

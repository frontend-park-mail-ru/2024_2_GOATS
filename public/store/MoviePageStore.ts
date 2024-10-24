import { dispatcher } from 'flux/Dispatcher';
import { ActionTypes } from 'flux/ActionTypes';
import { MoviePage } from 'pages/MoviePage/MoviePage';
import { apiClient } from 'modules/ApiClient';
import { MovieDetailed } from 'types/movie';
import { serializeMovieDetailed } from 'modules/Serializer';

const moviePage = new MoviePage();

class MoviePageStore {
  #movie!: MovieDetailed;

  constructor() {
    dispatcher.register(this.reduce.bind(this));
  }

  setState(movie: MovieDetailed) {
    this.#movie = movie;
  }

  getMovie() {
    return this.#movie;
  }

  async getMovieRequest(id: number) {
    console.log(id);
    const response = await apiClient.get({
      path: `movies/1`,
    });

    const serializedMovieData = serializeMovieDetailed(response.movie_info);
    this.setState(serializedMovieData);

    moviePage.render();
  }

  async reduce(action: any) {
    switch (action.type) {
      case ActionTypes.RENDER_MOVIE_PAGE:
        moviePage.render();
        await this.getMovieRequest(action.payload);
        break;
      default:
        break;
    }
  }
}

export const moviePageStore = new MoviePageStore();

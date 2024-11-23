import { dispatcher } from 'flux/Dispatcher';
import { ActionTypes } from 'flux/ActionTypes';
import { GenresPage } from 'pages/GenresPage/GenresPage';
import { MovieSelection } from 'types/movie';
import { apiClient } from 'modules/ApiClient';
import { serializeCollections } from 'modules/Serializer';

const genresPage = new GenresPage();

class GenresPageStore {
  #movieGenres: MovieSelection[] = [];

  constructor() {
    dispatcher.register(this.reduce.bind(this));
  }

  setState(movieGenres: MovieSelection[]) {
    this.#movieGenres = movieGenres;
  }

  getGenres() {
    return this.#movieGenres;
  }

  async getGenresRequest() {
    const response = await apiClient.get({
      path: 'genres/',
    });

    const serializedSelections = serializeCollections(
      response.collections,
    ).sort((selection1: any, selection2: any) => selection1.id - selection2.id);

    if (serializedSelections.length !== this.#movieGenres.length) {
      this.setState(serializedSelections);
      genresPage.render();
    } else {
      this.setState(serializedSelections);
    }
  }

  async reduce(action: any) {
    switch (action.type) {
      case ActionTypes.RENDER_GENRES_PAGE:
        genresPage.render();
        await this.getGenresRequest();
        break;
      default:
        break;
    }
  }
}

export const genresPageStore = new GenresPageStore();

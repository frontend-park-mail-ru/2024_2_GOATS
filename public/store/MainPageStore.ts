import { dispatcher } from 'flux/Dispatcher';
import { ActionTypes } from 'flux/ActionTypes';
import { Actions } from 'flux/Actions';
import { MainPage } from 'pages/MainPage/MainPage';
import { Loader } from 'components/Loader/Loader';
import { apiClient } from 'modules/ApiClient';
import { MovieSelection } from 'types/movie';
import { serializeCollections } from 'modules/Serializer';
import { moviePageStore } from './MoviePageStore';
import { EventEmitter } from 'events';
import { userStore } from './UserStore';

const mainPage = new MainPage();

class MainPageStore {
  #movieSelections: MovieSelection[] = [];

  constructor() {
    dispatcher.register(this.reduce.bind(this));
  }

  setState(movieSelections: MovieSelection[]) {
    this.#movieSelections = movieSelections;
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
      this.setState(serializedSelections);
    } else {
      this.setState(serializedSelections);
    }
  }

  rateMovie() {}

  async reduce(action: any) {
    switch (action.type) {
      case ActionTypes.RENDER_MAIN_PAGE:
        mainPage.render();
        await this.getCollection();
        if (
          userStore.getUser().username &&
          !userStore.isUserLoadingEmmiter$.get()
        ) {
          await moviePageStore.getLastMoviesRequest();
        }
        mainPage.render();
        break;
      default:
        break;
    }
  }
}

export const mainPageStore = new MainPageStore();

import { dispatcher } from 'flux/Dispatcher';
import { ActionTypes } from 'flux/ActionTypes';
import { Actions } from 'flux/Actions';
import { MainPage } from './MainPage';
import { Loader } from '../../components/Loader/Loader';
import { apiClient } from 'modules/ApiClient';
import { MovieSelection } from 'types/movie';
import { serializeCollections } from 'modules/Serializer';

const mainPage = new MainPage();

class MainPageStore {
  #movieSelections: MovieSelection[] = [];

  constructor() {
    console.log('constructor header');
    dispatcher.register(this.reduce.bind(this));
  }

  setState(movieSelections: MovieSelection[]) {
    this.#movieSelections = movieSelections;
  }

  getSelections() {
    return this.#movieSelections;
  }

  /**
   * send request for movies collection
   * @param {}
   * @returns {}
   */
  async getCollection() {
    const response = await apiClient.get({
      path: 'movie_collections/',
    });

    const serializedSelections = serializeCollections(
      response.collections,
    ).sort((selection1: any, selection2: any) => selection1.id - selection2.id);

    this.setState(serializedSelections);
  }

  async reduce(action: any) {
    switch (action.type) {
      case ActionTypes.RENDER_MAIN_PAGE:
        // const root = document.getElementById('root') as HTMLElement;
        // const pageElement = document.getElementsByTagName(
        //   'main',
        // )[0] as HTMLElement;
        // console.log(pageElement.outerHTML);
        // const loader = new Loader(root, pageElement.outerHTML);
        // loader.render();
        await this.getCollection();
        mainPage.render();
        break;
      //   case ActionTypes.GET_SELECTIONS:
      //     this.getCollection();
      //     break;
      default:
        break;
    }
  }
}

export const mainPageStore = new MainPageStore();

import { dispatcher } from 'flux/Dispatcher';
import { SearchBlock } from 'components/SearchBlock/SearchBlock';
import { ActionTypes } from 'flux/ActionTypes';
import { Movie } from 'types/movie';
import { ActorInfo } from 'types/actor';
import { userStore } from './UserStore';
import { apiClient } from 'modules/ApiClient';
import { Emitter } from 'modules/Emmiter';
import { serializeMovie } from 'modules/Serializer';

const searchBlock = new SearchBlock();

class SearchBlockStore {
  #findPersons: ActorInfo[];
  #findMovies: Movie[];

  //   #isDataLoading: boolean;
  // #isDataLoadingEmmitter: Emitter<boolean>;

  constructor() {
    this.#findMovies = [];
    this.#findPersons = [];

    // this.#isDataLoading = false;
    // this.#isDataLoadingEmmitter = new Emitter<boolean>(false);

    const inputChangeListener = searchBlock.inputEmmitter$.addListener(() => {
      this.searchRequest();
    });

    const categoryChangeListener = searchBlock.navEmmitter$.addListener(() => {
      this.searchRequest();
    });

    this.ngOnDestroy = () => {
      inputChangeListener();
      categoryChangeListener();
    };
    dispatcher.register(this.reduce.bind(this));
  }

  // get dataLoadingEmmitter$(): Emitter<boolean> {
  //   return this.#isDataLoadingEmmitter;
  // }

  ngOnDestroy(): void {}

  renderSearchBlock() {
    searchBlock.render();
  }

  getMovies() {
    return this.#findMovies;
  }

  async searchRequest() {
    try {
      this.#findMovies = [];
      //   this.#isDataLoadingEmmitter.set(true);
      console.log(
        'Ищем ',
        searchBlock.getInputValue,
        'в категории',
        searchBlock.getSelectedCategory,
      );
      const response = await apiClient.get({
        path: 'movie_collections/',
      }); // Дождаться реальных данных

      this.#findMovies = response.collections[1].movies.map(serializeMovie);
      searchBlock.renderItemsList();
    } catch (e) {
      console.log(e);
    }
  }

  updateOptionsList() {}

  reduce(action: any) {
    switch (action.type) {
      case ActionTypes.RENDER_SEARCH_BLOCK:
        this.renderSearchBlock();
        break;
      default:
        break;
    }
  }
}

export const searchBlockStore = new SearchBlockStore();

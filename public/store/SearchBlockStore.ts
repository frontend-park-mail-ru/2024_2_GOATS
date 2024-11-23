import { dispatcher } from 'flux/Dispatcher';
import { SearchBlock } from 'components/SearchBlock/SearchBlock';
import { ActionTypes } from 'flux/ActionTypes';
import { Movie } from 'types/movie';
import { ActorInfo } from 'types/actor';
import { userStore } from './UserStore';
import { apiClient } from 'modules/ApiClient';
import { Emitter } from 'modules/Emmiter';
import { serializeMovie } from 'modules/Serializer';
import { findActors, findMovies } from 'types/searchTypes';

const searchBlock = new SearchBlock();

class SearchBlockStore {
  #findPersons: findActors[];
  #findMovies: findMovies[];

  // #isDataLoading: boolean;
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
  //   console.log('----------')
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
      // this.#isDataLoadingEmmitter.set(true);
      console.log(
        'Ищем ',
        searchBlock.getInputValue,
        'в категории',
        searchBlock.getSelectedCategory,
      );

      const tmp =
        searchBlock.getSelectedCategory === 'movies' ? 'title' : 'name';

      const response = await fetch(
        `http://localhost:9200/${searchBlock.getSelectedCategory}/_search`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: {
              match_phrase_prefix: {
                [tmp]: searchBlock.getInputValue,
              },
            },
          }),
        },
      );
      // const response = await apiClient.get({
      //   path: 'movie_collections/',
      // }); // Дождаться реальных данных
      const data = await response.json();

      this.#findMovies = data.hits.hits;
      searchBlock.renderItemsList(searchBlock.getSelectedCategory);
      // this.#isDataLoadingEmmitter.set(false);
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

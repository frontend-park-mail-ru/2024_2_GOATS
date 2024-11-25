import { dispatcher } from 'flux/Dispatcher';
import { SearchBlock } from 'components/SearchBlock/SearchBlock';
import { ActionTypes } from 'flux/ActionTypes';
import { Movie } from 'types/movie';
import { ActorInfo } from 'types/actor';
import { userStore } from './UserStore';
import { apiClient } from 'modules/ApiClient';
import { Emitter } from 'modules/Emmiter';
import {
  serializeActorData,
  serializeMovie,
  serializeSearchActorData,
} from 'modules/Serializer';
import { findActors, findMovies } from 'types/searchTypes';

const searchBlock = new SearchBlock();

class SearchBlockStore {
  #findItems: Movie[];
  #searchValue: string;
  #selectedNav: string;

  constructor() {
    this.#findItems = [];
    this.#searchValue = '';
    this.#selectedNav = 'movies';

    const inputChangeListener = searchBlock.inputEmmitter$.addListener(
      (value: string) => {
        this.#searchValue = value;
        this.searchRequest();
      },
    );

    const categoryChangeListener = searchBlock.navEmmitter$.addListener(
      (value) => {
        this.#selectedNav = value;
        this.searchRequest();
      },
    );

    this.ngOnDestroy = () => {
      inputChangeListener();
      categoryChangeListener();
    };
    dispatcher.register(this.reduce.bind(this));
  }

  clearFounded() {
    this.#findItems = [];
    this.#searchValue = '';
    this.#selectedNav = 'movies';
  }

  ngOnDestroy(): void {}

  renderSearchBlock() {
    searchBlock.render();
  }

  getMovies() {
    return this.#findItems;
  }

  async searchRequest() {
    try {
      this.#findItems = [];

      // const response = await apiClient.get({
      //   path: `movies/${this.#selectedNav}/search?query=${this.#searchValue}`,
      // });

      const response = await fetch(
        `http://localhost:8080/api/movies/${this.#selectedNav}/search?query=${this.#searchValue}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            mode: 'cors',
          },
        },
      );
      const data = await response.json();

      if (this.#selectedNav === 'movies') {
        this.#findItems = data.map((movie: Movie) => {
          return serializeMovie(movie);
        });
      } else {
        this.#findItems = data.map((movie: Movie) => {
          return serializeSearchActorData(movie);
        });
      }
      searchBlock.renderItemsList(this.#selectedNav, false);
    } catch (e: any) {
      searchBlock.renderItemsList(this.#selectedNav, true);
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

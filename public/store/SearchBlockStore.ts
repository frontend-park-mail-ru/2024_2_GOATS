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

const searchBlock = new SearchBlock();

class SearchBlockStore {
  #findItems: Movie[];
  #searchValue: string;
  #selectedNav: string;

  #findItemsEmmiter: Emitter<boolean>;

  constructor() {
    this.#findItems = [];
    this.#findItemsEmmiter = new Emitter<boolean>(false);
    this.#searchValue = '';
    this.#selectedNav = 'movies';

    const inputChangeListener = searchBlock.inputEmmitter$.addListener(
      (value: string) => {
        this.#searchValue = value;
        this.globalSearchRequest();
      },
    );

    const categoryChangeListener = searchBlock.navEmmitter$.addListener(
      (value) => {
        this.#selectedNav = value;
        this.globalSearchRequest();
      },
    );

    this.ngOnDestroy = () => {
      inputChangeListener();
      categoryChangeListener();
    };
    dispatcher.register(this.reduce.bind(this));
  }
  get movEm$(): Emitter<boolean> {
    return this.#findItemsEmmiter;
  }
  findMovies(a: string) {
    this.moviesSearchRequest(a);
  }

  clearFounded() {
    this.#findItems = [];
    this.#searchValue = '';
    this.#selectedNav = 'movies';
    this.#findItemsEmmiter.set(false);
  }

  ngOnDestroy(): void {}

  renderSearchBlock() {
    searchBlock.render();
  }

  getMovies() {
    return this.#findItems;
  }

  async globalSearchRequest() {
    try {
      this.#findItems = [];

      const response = await apiClient.get({
        path: `movies/${this.#selectedNav}/search?query=${this.#searchValue}`,
      });

      if (this.#selectedNav === 'movies') {
        this.#findItems = response.map((movie: Movie) => {
          return serializeMovie(movie);
        });
      } else {
        this.#findItems = response.map((movie: Movie) => {
          return serializeSearchActorData(movie);
        });
      }
      searchBlock.renderItemsList(this.#selectedNav, false);
    } catch (e: any) {
      searchBlock.renderItemsList(this.#selectedNav, true);
    }
  }

  async moviesSearchRequest(searchQuery: string) {
    try {
      this.#findItems = [];
      const response = await apiClient.get({
        path: `movies/movies/search?query=${searchQuery}`,
      });
      console.log(response);
      this.#findItems = response.map((movie: Movie) => {
        return serializeMovie(movie);
      });
      this.#findItemsEmmiter.set(true);
    } catch (e: any) {
      this.#findItems = [];
      this.#findItemsEmmiter.set(false);
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

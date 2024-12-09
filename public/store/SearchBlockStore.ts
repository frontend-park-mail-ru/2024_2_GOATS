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
import { CreateRoomModal } from 'components/CreateRoomModal/CreateRoomModal';

const searchBlock = new SearchBlock();
const createRoomModal = new CreateRoomModal();

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
        this.globalSearchRequest();
      },
    );

    const categoryChangeListener = searchBlock.navEmmitter$.addListener(
      (value) => {
        this.#selectedNav = value;
        this.globalSearchRequest();
      },
    );

    const createRoomInputChangeListener =
      createRoomModal.inputEmmitter$.addListener((value) => {
        this.#searchValue = value;
        this.#selectedNav = 'movies';
        this.globalSearchRequest();
      });

    this.ngOnDestroy = () => {
      inputChangeListener();
      categoryChangeListener();
      createRoomInputChangeListener();
    };
    dispatcher.register(this.reduce.bind(this));
  }

  findMovies(a: string) {
    console.log(a);
    this.moviesSearchRequest(a);
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

      createRoomModal.renderMoviesList(this.#findItems, searchQuery);
    } catch (e: any) {
      createRoomModal.renderMoviesList(this.#findItems, searchQuery);
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

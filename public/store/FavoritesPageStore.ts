import { dispatcher } from 'flux/Dispatcher';
import { ActionTypes } from 'flux/ActionTypes';
import { FavoritesPage } from 'pages/FavoritesPage/FavoritesPage';
import { apiClient } from 'modules/ApiClient';
import { userStore } from './UserStore';
import { Movie } from 'types/movie';
import { serializeMovie } from 'modules/Serializer';
import { router } from 'modules/Router';
import { Actions } from 'flux/Actions';
import { moviePageStore } from './MoviePageStore';

const favoritePage = new FavoritesPage();

class FavoritesPageStore {
  #movies: Movie[] | null = null;

  constructor() {
    // const unsubscribe = userStore.isUserAuthEmmiter$.addListener(
    //   async (status) => {
    //     if (status && router.getCurrentPath() === `/favorites`) {
    //       await this.getFavorites();
    //       favoritePage.render();
    //     }
    //   },
    // );

    const unsubscribe = userStore.isUserLoadingEmmiter$.addListener(() => {
      if (router.getCurrentPath() === '/favorites') {
        this.renderFavoritesPage();
      }
    }); //TK

    this.ngOnDestroy = () => {
      unsubscribe();
    };

    dispatcher.register(this.reduce.bind(this));
  }

  ngOnDestroy(): void {}

  getMovies() {
    return this.#movies;
  }

  async getFavorites() {
    const response = await apiClient.get({
      path: `users/${userStore.getUser().id}/favorites`,
    });
    if (response.movies) {
      this.#movies = response.movies.map((movie: Movie) => {
        return serializeMovie(movie);
      });
    } else {
      this.#movies = [];
    }

    favoritePage.render();
  }

  async addToFavorites(id: number) {
    try {
      await apiClient.post({
        path: `users/favorites`,
        body: {
          movie_id: id,
        },
      });

      Actions.getMovie(moviePageStore.getMovie()?.id as number);
    } catch (error) {
      throw error;
    }
  }

  async deleteFromFavorites(id: number) {
    try {
      await apiClient.delete({
        path: `users/favorites`,
        body: {
          movie_id: id,
        },
      });

      Actions.getMovie(moviePageStore.getMovie()?.id as number);
    } catch (error) {
      throw error;
    }
  }

  async renderFavoritesPage() {
    this.#movies = null;
    favoritePage.render();
    if (userStore.getisUserLoading()) {
      return;
    }
    if (userStore.getUser().username) {
      await this.getFavorites();
      favoritePage.render();
    } else {
      router.go('/');
    }
  } //TK

  async reduce(action: any) {
    switch (action.type) {
      case ActionTypes.RENDER_FAVORITES_PAGE:
        // this.#movies = null;
        // favoritePage.render();
        // if (userStore.getUser().username) {
        //   await this.getFavorites();
        //   favoritePage.render();
        // }

        this.renderFavoritesPage(); // TK
        break;
      case ActionTypes.ADD_TO_FAVORITES:
        this.addToFavorites(action.id);
        break;
      case ActionTypes.DELETE_FROM_FAVORITES:
        this.deleteFromFavorites(action.id);
        break;
      default:
        break;
    }
  }
}

export const favoritesPageStore = new FavoritesPageStore();

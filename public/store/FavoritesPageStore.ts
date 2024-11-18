import { dispatcher } from 'flux/Dispatcher';
import { ActionTypes } from 'flux/ActionTypes';
import { FavoritesPage } from 'pages/FavoritesPage/FavoritesPage';
import { apiClient } from 'modules/ApiClient';
import { userStore } from './UserStore';
import { Movie } from 'types/movie';
import { serializeMovie } from 'modules/Serializer';
import { router } from 'modules/Router';

const favoritePage = new FavoritesPage();

class FavoritesPageStore {
  #movies: Movie[] | null = null;

  constructor() {
    const unsubscribe = userStore.isUserAuthEmmiter$.addListener(
      async (status) => {
        if (status && router.getCurrentPath() === `/favorites`) {
          await this.getFavorites();
          favoritePage.render();
        }
      },
    );

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

    this.#movies = response.movies.map((movie: Movie) => {
      return serializeMovie(movie);
    });
  }

  addToFavorites(id: number) {
    apiClient.post({
      path: `users/favorites`,
      body: {
        movie_id: id,
      },
    });
  }

  deleteFromFavorites(id: number) {
    apiClient.delete({
      path: `users/favorites`,
      body: {
        movie_id: id,
      },
    });
  }

  async reduce(action: any) {
    switch (action.type) {
      case ActionTypes.RENDER_FAVORITES_PAGE:
        favoritePage.render();
        if (userStore.getUser().username) {
          await this.getFavorites();
          favoritePage.render();
        }
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

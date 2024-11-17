import { dispatcher } from 'flux/Dispatcher';
import { ActionTypes } from 'flux/ActionTypes';
import { FavoritesPage } from 'pages/FavoritesPage/FavoritesPage';

class FavoritesPageStore {
  constructor() {
    dispatcher.register(this.reduce.bind(this));
  }

  renderFavoritesPage() {
    const favoritePage = new FavoritesPage();
    favoritePage.render();
  }
  reduce(action: any) {
    switch (action.type) {
      case ActionTypes.RENDER_FAVORITES_PAGE:
        this.renderFavoritesPage();
        break;
      default:
        break;
    }
  }
}

export const favoritesPageStore = new FavoritesPageStore();

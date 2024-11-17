import { dispatcher } from 'flux/Dispatcher';
import { ActionTypes } from 'flux/ActionTypes';
import { GenresPage } from 'pages/GenresPage/GenresPage';

class GenresPageStore {
  constructor() {
    dispatcher.register(this.reduce.bind(this));
  }

  renderGenresPage() {
    const genresPage = new GenresPage();
    genresPage.render();
  }
  reduce(action: any) {
    switch (action.type) {
      case ActionTypes.RENDER_GENRES_PAGE:
        this.renderGenresPage();
        break;
      default:
        break;
    }
  }
}

export const genresPageStore = new GenresPageStore();

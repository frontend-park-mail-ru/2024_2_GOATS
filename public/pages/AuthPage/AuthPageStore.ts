import { ActionTypes } from 'flux/ActionTypes';
import { dispatcher } from 'flux/Dispatcher';
import { AuthPage } from './AuthPage';
import { Actions } from 'flux/Actions';

class AuthPageStore {
  constructor() {
    dispatcher.register(this.reduce.bind(this));
  }

  renderAuth() {
    // Actions.renderHeader();
    const authPage = new AuthPage();
    authPage.render();
  }

  reduce(action: any) {
    switch (action.type) {
      case ActionTypes.RENDER_AUTH_PAGE:
        this.renderAuth();
        break;

      default:
        break;
    }
  }
}

export const authPageStore = new AuthPageStore();

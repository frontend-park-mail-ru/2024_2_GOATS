import { ActionTypes } from 'flux/ActionTypes';
import { dispatcher } from 'flux/Dispatcher';
import { RegPage } from './RegPage';

class RegPageStore {
  constructor() {
    dispatcher.register(this.reduce.bind(this));
  }

  renderReg() {
    const regPage = new RegPage();
    regPage.render();
  }

  reduce(action: any) {
    switch (action.type) {
      case ActionTypes.RENDER_REG_PAGE:
        this.renderReg();
        break;

      default:
        break;
    }
  }
}

export const regPageStore = new RegPageStore();

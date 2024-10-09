import { User } from 'types/user';
import { ActionTypes } from './ActionTypes';
import { dispatcher } from './Dispatcher';

export const Actions = {
  renderMainPage() {
    dispatcher.dispatch({
      type: ActionTypes.RENDER_MAIN_PAGE,
    });
  },
  renderAuthPage() {
    dispatcher.dispatch({
      type: ActionTypes.RENDER_AUTH_PAGE,
    });
  },
  renderHeader(user: User) {
    dispatcher.dispatch({
      type: ActionTypes.RENDER_HEADER,
      user,
    });
  },
  getUser() {
    dispatcher.dispatch({
      type: ActionTypes.GET_USER,
    });
  },
};

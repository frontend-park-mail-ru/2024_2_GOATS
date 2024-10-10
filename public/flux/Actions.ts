import { User } from 'types/user';
import { ActionTypes } from './ActionTypes';
import { dispatcher } from './Dispatcher';

export const Actions = {
  renderMainPage() {
    console.log('render main page action');
    dispatcher.dispatch({
      type: ActionTypes.RENDER_MAIN_PAGE,
    });
  },
  renderAuthPage() {
    dispatcher.dispatch({
      type: ActionTypes.RENDER_AUTH_PAGE,
    });
  },
  renderRegPage() {
    dispatcher.dispatch({
      type: ActionTypes.RENDER_REG_PAGE,
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
  getSelections() {
    console.log('get selection action');
    dispatcher.dispatch({
      type: ActionTypes.GET_SELECTIONS,
    });
  },
};

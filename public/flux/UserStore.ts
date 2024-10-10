import { dispatcher } from './Dispatcher';
import { ActionTypes } from './ActionTypes';
import { apiClient } from 'modules/ApiClient';
import { Actions } from './Actions';
import { router } from 'modules/Router';
import { User } from 'types/user';

const headerElement = document.createElement('header');

class UserStore {
  #user: any;

  constructor() {
    this.#user = {
      email: '',
      username: '',
      isAuth: false,
    };
    dispatcher.register(this.reduce.bind(this));
  }

  getUser() {
    return this.#user;
  }

  setState(user: User) {
    this.#user.isAuth = user.isAuth;
    this.#user.email = user.email;
    this.#user.username = user.username;
  }

  reduce(action: any) {
    switch (action.type) {
      case ActionTypes.GET_USER:
        this.checkAuth();
        break;

      case ActionTypes.LOGOUT:
        this.logout();
        break;

      default:
        break;
    }
  }

  async checkAuth() {
    try {
      const response = await apiClient.get({
        path: 'auth/session',
      });
      this.setState({
        email: 'aa',
        username: 'aa',
        isAuth: true,
      });

      // this.setState(response.user_data);
    } catch {
      // this.setState({
      //   email: 'aa',
      //   username: 'aa',
      //   isAuth: true,
      // });
      console.log('auth request failed');
    } finally {
      Actions.renderHeader(this.#user);
      // updatePagesConfig(pagesConfig, currentUser);
    }
  }

  async logout() {
    try {
      await apiClient.post({
        path: 'auth/logout',
        body: {},
      });
      this.checkAuth();
    } catch {
      throw new Error('logout error');
    }
  }
}

export const userStore = new UserStore();

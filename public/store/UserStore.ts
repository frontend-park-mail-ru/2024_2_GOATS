import { dispatcher } from 'flux/Dispatcher';
import { ActionTypes } from 'flux/ActionTypes';
import { apiClient } from 'modules/ApiClient';
import { Actions } from 'flux/Actions';
import { router } from 'modules/Router';
import { User } from 'types/user';
import { EventEmitter } from 'events';

const headerElement = document.createElement('header');

class UserStore {
  #user: any;
  #isLoading: boolean;

  constructor() {
    this.#user = {
      email: '',
      username: '',
      isAuth: false,
    };
    this.#isLoading = true;
    dispatcher.register(this.reduce.bind(this));
  }

  getUser() {
    return this.#user;
  }

  getIsLoading() {
    return this.#isLoading;
  }

  setState(user: User) {
    this.#user.isAuth = user.isAuth;
    this.#user.email = user.email;
    this.#user.username = user.username;

    this.#isLoading = false;
    const url = new URL(window.location.href);
    Actions.renderHeader(url.pathname.toString());
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

  async checkAuth(emit?: boolean) {
    this.#isLoading = true;
    try {
      const response = await apiClient.get({
        path: 'auth/session',
      });
      // this.setState({
      //   email: 'aa',
      //   username: 'aa',
      //   isAuth: true,
      // });

      // this.setState(response.user_data);
    } catch {
      this.setState({
        email: 'aa',
        username: 'aa',
        isAuth: emit || false, // toggle to imitate login
      });
      console.log('auth request failed');
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

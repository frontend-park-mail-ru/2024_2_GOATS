import { dispatcher } from 'flux/Dispatcher';
import { ActionTypes } from 'flux/ActionTypes';
import { apiClient } from 'modules/ApiClient';
import { Actions } from 'flux/Actions';
import { router } from 'modules/Router';
import { User } from 'types/user';
import { EventEmitter } from 'events';
import { Emitter } from 'modules/Emmiter';
import { serializeUserData } from 'modules/Serializer';
const headerElement = document.createElement('header');

class UserStore {
  #user: User;
  #isUserAuth: boolean;
  #isLoading: boolean;
  #isUserAuthEmmiter: Emitter<boolean>;

  constructor() {
    this.#isUserAuthEmmiter = new Emitter<boolean>(false);
    this.#user = {
      id: -1,
      email: '',
      username: '',
      // isAuth: false,
      avatar: '',
    };
    this.#isUserAuth = false;
    this.#isLoading = true;
    dispatcher.register(this.reduce.bind(this));
  }

  get isUserAuthEmmiter$(): Emitter<boolean> {
    return this.#isUserAuthEmmiter;
  }

  getUser() {
    return this.#user;
  }

  getUserAuthStatus() {
    return this.#isUserAuth;
  }

  getIsLoading() {
    return this.#isLoading;
  }

  setState(user: User) {
    // this.#user.isAuth = true;
    this.#isUserAuth = true;

    this.#user.id = user.id;
    this.#user.email = user.email;
    this.#user.username = user.username;
    this.#user.avatar = user.avatar;

    console.log('user change status');
    this.#isUserAuthEmmiter.set(true);
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

  clearUser() {
    // this.#user.isAuth = false;
    this.#isUserAuth = false;

    this.#user.email = '';
    this.#user.username = '';
    this.#user.avatar = '';
    this.#user.id = 0;

    this.#isLoading = false;
    this.#isUserAuthEmmiter.set(false);
    const url = new URL(window.location.href);
    Actions.renderHeader(url.pathname.toString());
  }

  async checkAuth(emit?: boolean) {
    this.#isLoading = true;
    try {
      const response = await apiClient.get({
        path: 'auth/session',
      });
      this.setState(serializeUserData(response.user_data));
    } catch {
      this.clearUser();
      console.log('auth request failed', emit);
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

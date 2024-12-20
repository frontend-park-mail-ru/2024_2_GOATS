import { dispatcher } from 'flux/Dispatcher';
import { ActionTypes } from 'flux/ActionTypes';
import { apiClient } from 'modules/ApiClient';
import { Actions } from 'flux/Actions';
import { router } from 'modules/Router';
import { User } from 'types/user';
import { EventEmitter } from 'events';
import { Emitter } from 'modules/Emmiter';
import { serializeUserData } from 'modules/Serializer';
import { checkLocalStorage, clearLocalStorage } from 'modules/LocalStorage';
const headerElement = document.createElement('header');

class UserStore {
  #user: User;
  #csrfToken = '';

  #isUserAuth: boolean;
  #isUserAuthEmmiter: Emitter<boolean>;

  #isUserLoading: boolean;
  #isUserLoadingEmmiter: Emitter<boolean>;

  constructor() {
    this.#isUserAuthEmmiter = new Emitter<boolean>(false);
    this.#isUserAuth = false;

    this.#isUserLoadingEmmiter = new Emitter<boolean>(true);
    this.#isUserLoading = true;

    this.#user = {
      id: -1,
      email: '',
      username: '',
      avatar: '',
      isPremium: false,
      expirationDate: '',
    };
    dispatcher.register(this.reduce.bind(this));
  }

  get isUserAuthEmmiter$(): Emitter<boolean> {
    return this.#isUserAuthEmmiter;
  }
  get isUserLoadingEmmiter$(): Emitter<boolean> {
    return this.#isUserLoadingEmmiter;
  }

  getUser() {
    return this.#user;
  }

  getCsrfToken() {
    return this.#csrfToken;
  }

  getUserAuthStatus() {
    return this.#isUserAuth;
  }

  getisUserLoading() {
    return this.#isUserLoading;
  }

  setState(user: User) {
    this.#isUserAuth = true;

    this.#user.id = user.id;
    this.#user.email = user.email;
    this.#user.username = user.username;
    this.#user.avatar = user.avatar;
    this.#user.isPremium = user.isPremium;
    this.#user.expirationDate = user.expirationDate;

    this.#isUserAuthEmmiter.set(true);

    this.#isUserLoading = false;
    this.#isUserLoadingEmmiter.set(false);

    const url = new URL(window.location.href);
    Actions.renderHeader(url.pathname.toString());
  }

  reduce(action: any) {
    switch (action.type) {
      case ActionTypes.GET_USER:
        this.checkAuth();
        break;

      case ActionTypes.GET_CSRF:
        this.getCsrf();
        break;

      case ActionTypes.LOGOUT:
        this.logout();
        break;

      default:
        break;
    }
  }

  clearUser() {
    this.#isUserAuth = false;

    this.#user.email = '';
    this.#user.username = '';
    this.#user.avatar = '';
    this.#user.id = 0;
    this.#user.isPremium = false;

    this.#isUserLoading = false;
    this.#isUserLoadingEmmiter.set(false);

    this.#isUserAuthEmmiter.set(false);
    const url = new URL(window.location.href);
    Actions.renderHeader(url.pathname.toString());
  }

  async checkAuth() {
    this.#isUserLoading = true;
    this.#isUserLoadingEmmiter.set(true);

    try {
      const response = await apiClient.get({
        path: 'auth/session',
      });

      response.user_data.email = response.user_data.email.replace(
        /&#34;/g,
        '"',
      );
      this.setState(serializeUserData(response.user_data));

      if (checkLocalStorage()) {
        Actions.copyLastMovies();
        clearLocalStorage();
      }
    } catch {
      this.clearUser();
    }
  }

  async getCsrf() {
    try {
      const response = await apiClient.get({
        path: 'csrf-token',
      });
      this.#csrfToken = response.headers.get('x-csrf-token');
    } catch (e) {
      throw e;
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

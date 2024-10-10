import { dispatcher } from 'flux/Dispatcher';
import { ActionTypes } from 'flux/ActionTypes';
import { userStore } from 'flux/UserStore';
import { Actions } from 'flux/Actions';
import { Header } from './Header';
import { router } from 'modules/Router';
import { User } from 'types/user.js';

class HeaderStore {
  #config;

  constructor() {
    console.log('constructor header');
    this.#config = {
      pages: {
        main: {
          text: 'Главная',
          href: '/',
          id: 'header-main',
          isAvailable: userStore.getUser().isAuth,
          render: () => router.go('/'),
        },
        reg: {
          text: 'Регистрация',
          href: '/register',
          id: 'header-reg',
          isAvailable: !userStore.getUser().isAuth,
          render: () => router.go('/registration'),
        },
        auth: {
          text: 'Авторизация',
          href: '/auth',
          id: 'header-auth',
          isAvailable: !userStore.getUser().isAuth,
          render: () => router.go('/auth'),
        },
      },
    };
    dispatcher.register(this.reduce.bind(this));
  }

  setState(user: User) {
    this.#config.pages.main.isAvailable = true;
    this.#config.pages.reg.isAvailable = !user.isAuth;
    this.#config.pages.auth.isAvailable = !user.isAuth;
  }

  renderHeader(user: User) {
    const header = new Header(this.#config);
    this.setState(user);
    header.render();
  }

  reduce(action: any) {
    switch (action.type) {
      case ActionTypes.RENDER_HEADER:
        this.renderHeader(action.user);
        break;

      default:
        break;
    }
  }
}

export const headerStore = new HeaderStore();

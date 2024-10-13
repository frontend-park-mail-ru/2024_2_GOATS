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
    this.#config = {
      pages: {
        main: {
          text: 'Главная',
          href: '/',
          id: 'header-main',
          isAvailable: true,
          render: () => router.go('/'),
        },
        reg: {
          text: 'Регистрация',
          href: '/registration',
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

  renderHeader(url: string) {
    if (!userStore.getIsLoading()) {
      const user = userStore.getUser();
      this.setState(user);

      const header = new Header(this.#config, url);
      header.render();
    }

    // const header = new Header(this.#config, url);
    // header.render();
  }

  reduce(action: any) {
    switch (action.type) {
      case ActionTypes.RENDER_HEADER:
        this.renderHeader(action.payload);
        break;

      default:
        break;
    }
  }
}

export const headerStore = new HeaderStore();

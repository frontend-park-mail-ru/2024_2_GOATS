import { dispatcher } from 'flux/Dispatcher';
import { ActionTypes } from 'flux/ActionTypes';
import { userStore } from 'store/UserStore';
import { Actions } from 'flux/Actions';
import { Header } from 'components/Header/Header';
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
        // reg: {
        //   text: 'Регистрация',
        //   href: '/registration',
        //   id: 'header-reg',
        //   isAvailable: !userStore.getUser().isAuth,
        //   render: () => router.go('/registration'),
        // },
        auth: {
          text: 'Войти',
          href: '/auth',
          id: 'header-auth',
          isAvailable: !userStore.getUserAuthStatus(),
          render: () => router.go('/auth'),
        },
        profile: {
          text: 'Профиль',
          href: '/profile',
          id: 'header-profile',
          isAvailable: userStore.getUserAuthStatus(),
          render: () => router.go('/profile'),
        },
      },
    };
    dispatcher.register(this.reduce.bind(this));
  }

  setState(isAuth: boolean) {
    this.#config.pages.main.isAvailable = true;
    // this.#config.pages.reg.isAvailable = !user.isAuth;
    this.#config.pages.auth.isAvailable = !isAuth;
    this.#config.pages.profile.isAvailable = isAuth;
  }

  renderHeader(url: string) {
    console.log('///', url);
    if (!userStore.getIsLoading()) {
      const isUserAuth = userStore.getUserAuthStatus();
      this.setState(isUserAuth);

      const header = new Header(this.#config, url);
      header.render();
    }
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

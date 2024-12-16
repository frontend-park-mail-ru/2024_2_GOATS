import { dispatcher } from 'flux/Dispatcher';
import { ActionTypes } from 'flux/ActionTypes';
import { userStore } from 'store/UserStore';
import { Actions } from 'flux/Actions';
import { Header } from 'components/Header/Header';
import { router } from 'modules/Router';
import { User } from 'types/user.js';
import { roomPageStore } from './RoomPageStore';

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
          render: () => {
            if (router.getCurrentPath() !== '/') {
              router.go('/');
            }
            if (roomPageStore.getWs()) {
              roomPageStore.closeWs();
            }
          },
        },
        genres: {
          text: 'Жанры',
          href: '/genres',
          id: 'header-genres',
          isAvailable: true,
          render: () => {
            if (router.getCurrentPath() !== '/genres') {
              router.go('/genres');
            }
            if (roomPageStore.getWs()) {
              roomPageStore.closeWs();
            }
          },
        },
        favorites: {
          text: 'Избранное',
          href: '/favorites',
          id: 'header-favorites',
          isAvailable: userStore.getUserAuthStatus(),
          render: () => {
            if (router.getCurrentPath() !== '/favorites') {
              router.go('/favorites');
            }
            if (roomPageStore.getWs()) {
              roomPageStore.closeWs();
            }
          },
        },
        auth: {
          text: 'Войти',
          href: '/auth',
          id: 'header-auth',
          isAvailable: !userStore.getUserAuthStatus(),
          render: () => {
            if (router.getCurrentPath() !== '/auth') {
              router.go('/auth');
            }
            if (roomPageStore.getWs()) {
              roomPageStore.closeWs();
            }
          },
        },
        profile: {
          text: 'Профиль',
          href: '/profile',
          id: 'header-profile',
          isAvailable: userStore.getUserAuthStatus(),
          render: () => {
            router.go('/profile');
            if (roomPageStore.getWs()) {
              roomPageStore.closeWs();
            }
          },
        },
      },
    };
    dispatcher.register(this.reduce.bind(this));
  }

  setState(isAuth: boolean) {
    this.#config.pages.main.isAvailable = true;
    this.#config.pages.auth.isAvailable = !isAuth;
    this.#config.pages.profile.isAvailable = isAuth;
    this.#config.pages.genres.isAvailable = true;
    this.#config.pages.favorites.isAvailable = isAuth;
  }

  renderHeader(url: string) {
    if (!userStore.getisUserLoading()) {
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

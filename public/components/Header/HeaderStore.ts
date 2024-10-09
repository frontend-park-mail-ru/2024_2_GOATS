import { dispatcher } from 'flux/Dispatcher';
import { ActionTypes } from 'flux/ActionTypes';
import { userStore } from 'flux/UserStore';
import { Actions } from 'flux/Actions';
import { Header } from './Header';
import { router } from 'modules/Router';
import { User } from 'types/user.js';

// const rootElement = document.getElementById('root');
// console.log(document.getElementsByTagName('main'));
// const contentElement = document.querySelector('main');

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
          render: Actions.renderMainPage,
        },
        reg: {
          text: 'Регистрация',
          href: '/register',
          id: 'header-reg',
          isAvailable: !userStore.getUser().isAuth,
          render() {
            console.log('reg');
          },
        },
        auth: {
          text: 'Авторизация',
          href: '/auth',
          id: 'header-auth',
          isAvailable: !userStore.getUser().isAuth,
          render() {
            console.log('auth');
          },
        },
      },
    };
    dispatcher.register(this.reduce.bind(this));
  }

  setState(user: User) {
    this.#config.pages.main.isAvailable = user.isAuth;
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

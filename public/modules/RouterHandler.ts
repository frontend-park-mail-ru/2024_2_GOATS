import { MainPage } from 'pages/MainPage/MainPage';
import { AuthPage } from 'pages/AuthPage/AuthPage';
import { RegPage } from 'pages/RegPage/RegPage';
import { Header } from 'components/Header/Header';
import { User } from 'types/user';
import { apiClient } from './ApiClient';
import { setPagesConfig } from '../consts';
import { Actions } from 'flux/Actions';

// const rootElement = document.getElementById('root') as HTMLElement;
// const pageElement = document.createElement('main');

// pageElement.id = 'page-element';
// const headerElement = document.createElement('header');
// rootElement.appendChild(pageElement);
// rootElement.appendChild(headerElement);

// const authPage = new AuthPage(pageElement);
// const regPage = new RegPage(pageElement);

export const Urls = {
  root: '/',
  auth: '/login',
  registration: '/registration',
};

export const routerHandler = (url: URL) => {
  switch (url.pathname.toString()) {
    case Urls.root:
      Actions.renderMainPage();
      break;
    // case Urls.auth:
    //   authPage.render();
    //   break;
    // case Urls.registration:
    //   regPage.render();
    //   break;
    default:
      console.log('error', url.pathname);
  }
};

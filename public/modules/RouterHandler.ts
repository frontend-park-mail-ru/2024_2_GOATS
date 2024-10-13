import { MainPage } from 'pages/MainPage/MainPage';
import { AuthPage } from 'pages/AuthPage/AuthPage';
import { RegPage } from 'pages/RegPage/RegPage';
import { Header } from 'components/Header/Header';
import { User } from 'types/user';
import { apiClient } from './ApiClient';
import { setPagesConfig } from '../consts';
import { Actions } from 'flux/Actions';

export const Urls = {
  root: '/',
  auth: '/auth',
  registration: '/registration',
  actor: '/person',
};

export const routerHandler = (url: URL) => {
  switch (url.pathname.toString()) {
    case Urls.root:
      Actions.renderHeader(Urls.root);
      Actions.renderMainPage();
      break;
    case Urls.auth:
      Actions.renderHeader(Urls.auth);
      Actions.renderAuthPage();
      break;
    case Urls.registration:
      Actions.renderHeader(Urls.registration);
      Actions.renderRegPage();
      break;
    case Urls.actor:
      // Actions.renderHeader(Urls.registration);
      Actions.renderActorPage();
      break;

    default:
      console.log('error', url.pathname);
  }
};

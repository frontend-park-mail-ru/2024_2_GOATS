import { MainPage } from 'pages/MainPage/MainPage';
import { AuthPage } from 'pages/AuthPage/AuthPage';
import { RegPage } from 'pages/RegPage/RegPage';
import { Header } from 'components/Header/Header';
import { User } from 'types/user';
import { apiClient } from './ApiClient';
import { setPagesConfig } from '../consts';
import { Actions } from 'flux/Actions';
import { footer } from 'components/Footer/Footer';

export const Urls = {
  root: '/',
  auth: '/auth',
  registration: '/registration',
  movie: '/movie',
  // video: '/video',
  actor: '/person',
  profile: '/profile',
  room: '/room',
};

export const routerHandler = (url: URL) => {
  switch (url.pathname.toString()) {
    case Urls.root:
      Actions.renderHeader(Urls.root);
      Actions.renderMainPage();
      footer.render(Urls.root);
      break;
    case Urls.auth:
      Actions.renderHeader(Urls.auth);
      Actions.renderAuthPage();
      footer.render(Urls.auth);
      break;
    case Urls.registration:
      Actions.renderHeader(Urls.registration);
      Actions.renderRegPage();
      footer.render(Urls.registration);
      break;
    case Urls.actor:
      // Actions.renderHeader(Urls.registration);
      Actions.renderActorPage();
      footer.render(Urls.actor);
      break;
    case Urls.movie:
      Actions.renderMoviePage();
      footer.render(Urls.movie);
      break;
    case Urls.profile:
      Actions.renderProfilePage();
      break;
    case Urls.room:
      Actions.renderRoomPage();
      break;

    default:
      console.log('error', url.pathname);
  }
};

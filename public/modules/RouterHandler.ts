import { MainPage } from 'pages/MainPage/MainPage';
import { AuthPage } from 'pages/AuthPage/AuthPage';
import { RegPage } from 'pages/RegPage/RegPage';
import { Header } from 'components/Header/Header';
import { User } from 'types/user';
import { apiClient } from './ApiClient';
import { setPagesConfig } from '../consts';
import { Actions } from 'flux/Actions';
import { footer } from 'components/Footer/Footer';
import { router } from './Router';
import { userStore } from 'store/UserStore';

export const Urls = {
  root: '/',
  auth: '/auth',
  registration: '/registration',
  movie: '/movie',
  actor: '/person',
  profile: '/profile',
  room: '/room',
  genres: '/genres',
  favorites: '/favorites',
};

export const routerHandler = (url: URL, id?: string | number, data?: any) => {
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
    case `${Urls.actor}/${id}`:
      Actions.renderHeader(Urls.actor);
      id && Actions.renderActorPage(id);
      footer.render(Urls.actor);
      break;
    case `${Urls.movie}/${id}`:
      Actions.renderHeader(Urls.movie);

      if (id && data) {
        Actions.renderMoviePage(id, data.fromRecentlyWatched);
      } else if (id) {
        id && Actions.renderMoviePage(id);
      }
      footer.render(Urls.movie);
      break;
    case Urls.profile:
      Actions.renderHeader(Urls.profile);
      Actions.renderProfilePage();
      footer.render(Urls.profile);
      break;
    case `${Urls.room}/${id}`:
      Actions.renderHeader(Urls.room);
      id && Actions.renderRoomPage(id);
      footer.render(Urls.room);
      break;
    case Urls.favorites:
      Actions.renderHeader(Urls.favorites);
      Actions.renderFavoritesPage();
      footer.render(Urls.favorites);
      break;
    case Urls.genres:
      Actions.renderHeader(Urls.genres);
      Actions.renderGenresPage();
      footer.render(Urls.genres);
      break;
    default:
      router.go('/');
  }
};

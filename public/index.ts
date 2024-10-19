import './index.scss';
import { MainPage } from 'pages/MainPage/MainPage';
import { initialStore } from 'store/InitialStore';
import { userStore } from 'store/UserStore';
import { authPageStore } from 'store/AuthPageStore';
import { regPageStore } from 'store/RegPageStore';
import { headerStore } from 'store/HeaderStore';
import { mainPageStore } from 'store/MainPageStore';
import { moviePageStore } from 'store/MoviePageStore';
import { actorPageStore } from 'store/ActorPageStore';
import { profilePageStore } from 'store/ProfilePageStore';
import { roomPageStore } from 'store/RoomPageStore';
import { router } from 'modules/Router';

const root = document.getElementById('root') as HTMLElement;
const pageElement = document.createElement('main');
const headerElement = document.createElement('header');
const footerElement = document.createElement('footer');
const notifierElement = document.createElement('div');
notifierElement.id = 'notifier';

pageElement.id = 'page-element';
root.appendChild(headerElement);
root.appendChild(pageElement);
root.appendChild(footerElement);
root.appendChild(notifierElement);

const mockFunction = () => {
  console.log(initialStore);
  console.log(userStore);
  console.log(headerStore);
  console.log(authPageStore);
  console.log(regPageStore);
  console.log(mainPageStore);
  console.log(moviePageStore);
  console.log(actorPageStore);
  console.log(profilePageStore);
  console.log(roomPageStore);
};

initialStore.start();
router.start();

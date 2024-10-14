import './index.scss';
import { MainPage } from 'pages/MainPage/MainPage';
import { initialStore } from 'store/InitialStore';
import { userStore } from 'store/UserStore';
import { authPageStore } from 'store/AuthPageStore';
import { regPageStore } from 'store/RegPageStore';
import { headerStore } from 'store/HeaderStore';
import { mainPageStore } from 'store/MainPageStore';
import { actorPageStore } from 'store/ActorPageStore';
import { router } from 'modules/Router';

const root = document.getElementById('root') as HTMLElement;
const pageElement = document.createElement('main');
const headerElement = document.createElement('header');
const footerElement = document.createElement('footer');

pageElement.id = 'page-element';
root.appendChild(headerElement);
root.appendChild(pageElement);
root.appendChild(footerElement);

const mockFunction = () => {
  console.log(initialStore);
  console.log(userStore);
  console.log(headerStore);
  console.log(authPageStore);
  console.log(regPageStore);
  console.log(mainPageStore);
  console.log(actorPageStore);
};

initialStore.start();
router.start();

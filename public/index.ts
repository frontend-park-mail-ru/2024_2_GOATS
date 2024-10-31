import './index.scss';
import { router } from 'modules/Router';
import { initialStore } from 'store/InitialStore';
import 'store/UserStore';
import 'store/AuthPageStore';
import 'store/RegPageStore';
import 'store/HeaderStore';
import 'store/MainPageStore';
import 'store/MoviePageStore';
import 'store/ActorPageStore';
import 'store/ProfilePageStore';
import 'store/RoomPageStore';

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

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch((err) => {
    console.log('SW ERR: ', err);
  });
}

initialStore.start();
router.start();

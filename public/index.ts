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
import 'store/FavoritesPageStore';
import 'store/GenresPageStore';

const root = document.getElementById('root') as HTMLElement;
const pageElement = document.createElement('main');
const headerElement = document.createElement('header');
const footerElement = document.createElement('footer');
const notifierElement = document.createElement('div');
const previewElement = document.createElement('div');
notifierElement.id = 'notifier';
previewElement.id = 'preview';

pageElement.id = 'page-element';
root.appendChild(headerElement);
root.appendChild(pageElement);
root.appendChild(footerElement);
root.appendChild(notifierElement);
root.appendChild(previewElement);

// if ('serviceWorker' in navigator) {
//   console.log('serviceWorker is supported');
//   navigator.serviceWorker
//     .register('sw.js', { scope: '/' })
//     .then(() => console.log('serviceWorker has been registered'))
//     .catch((err) => {
//       console.log('SW ERR: ', err);
//     });
// }

initialStore.start();
router.start();

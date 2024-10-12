import './index.scss';
import { MainPage } from 'pages/MainPage/MainPage';
import { initialStore } from 'flux/InitialStore';
import { userStore } from 'flux/UserStore';
import { authPageStore } from 'pages/AuthPage/AuthPageStore';
import { regPageStore } from 'pages/RegPage/RegPageStore';
import { headerStore } from 'components/Header/HeaderStore';
import { mainPageStore } from 'pages/MainPage/MainPageStore';
import { router } from 'modules/Router';
// const { EventEmitter } = require('events')
import { EventEmitter } from 'events';

class ShoeStore extends EventEmitter {
  constructor() {
    super();
  }

  getShoes(): string {
    return 'dfdf';
  }

  emitChange(): void {
    this.emit('change');
  }

  addChangeListener(callback: (event: any) => void): void {
    this.on('change', callback);
  }

  removeChangeListener(callback: (event: any) => void): void {
    this.removeListener('change', callback);
  }
}

const root = document.getElementById('root') as HTMLElement;
const pageElement = document.createElement('main');
const headerElement = document.createElement('header');
pageElement.id = 'page-element';
root.appendChild(headerElement);
root.appendChild(pageElement);

const mockFunction = () => {
  console.log(initialStore);
  console.log(userStore);
  console.log(headerStore);
  console.log(authPageStore);
  console.log(regPageStore);
  console.log(mainPageStore);
};

const test = new ShoeStore();

initialStore.start();

setTimeout(() => {
  router.start();
}, 200);

// const rootElement = document.getElementById('root') as HTMLElement;
// const headerElement = document.createElement('header');
// const pageElement = document.createElement('main');

// const notifierElement = document.createElement('div');
// notifierElement.id = 'notifier';

// rootElement.appendChild(headerElement);
// rootElement.appendChild(pageElement);
// rootElement.appendChild(notifierElement);

// export let currentUser: User = {};
// export let isAuthorised = false;

// const pagesConfig = setPagesConfig(
//   currentUser,
//   renderMainPage,
//   renderAuthPage,
//   renderRegPage,
// );

// export const checkAuth = async () => {
//   try {
//     const response = await apiClient.get({
//       path: 'auth/session',
//     });

//     currentUser = response.user_data;
//   } catch {
//     currentUser = {};
//   } finally {
//     updatePagesConfig(pagesConfig, currentUser);
//   }
// };

// function updatePagesConfig(config: any, currentUser: User) {
//   config.pages.login.isAvailable = !currentUser.username;
//   config.pages.signup.isAvailable = !currentUser.username;
//   renderHeader();
// }

// const mainPage = new MainPage(pageElement);
// const authPage = new AuthPage(pageElement);
// const regPage = new RegPage(pageElement);
// const header = new Header(headerElement, pagesConfig);

// function renderHeader() {
//   header.render();

//   headerElement.addEventListener('click', (e: MouseEvent) => {
//     const { target } = e;

//     if (
//       (target instanceof HTMLElement && target.tagName.toLowerCase() === 'a') ||
//       target instanceof HTMLAnchorElement
//     ) {
//       e.preventDefault();
//       goToPage(target);
//     }
//   });
// }

// function renderMainPage() {
//   mainPage.render();
// }
// function renderAuthPage() {
//   authPage.render();
// }
// function renderRegPage() {
//   regPage.render();
// }

// export function goToPage(headerLinkElement: HTMLElement) {
//   if (
//     headerLinkElement.dataset.section ==
//     header.state.activeHeaderLink?.dataset.section
//   ) {
//     return;
//   }

//   pageElement.innerHTML = '';

//   Object.values(header.state.navElements).forEach((el) =>
//     el.classList.remove('active'),
//   );
//   header.state.activeHeaderLink?.classList.remove('active');
//   headerLinkElement.classList.add('active');
//   header.state.activeHeaderLink = headerLinkElement;
//   if (headerLinkElement.dataset.section) {
//     pagesConfig.pages[
//       headerLinkElement.dataset.section as keyof typeof pagesConfig.pages
//     ].render();
//   }
// }
// renderMainPage();
// begin();
// async function begin() {
// console.log(initialStore);

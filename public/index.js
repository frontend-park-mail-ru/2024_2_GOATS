import { MainPage } from './pages/MainPage/MainPage.js';
import { AuthPage } from './pages/AuthPage/AuthPage.js';

import './index.css';
import { Header } from './components/Header/Header.js';
import { RegPage } from './pages/RegPage/RegPage.js';
import { setPagesConfig } from './consts.js';

import { apiClient } from './modules/ApiClient.js';

const rootElement = document.getElementById('root');
const headerElement = document.createElement('header');
const pageElement = document.createElement('main');

const notifierElement = document.createElement('div');
notifierElement.id = 'notifier';

rootElement.appendChild(headerElement);
rootElement.appendChild(pageElement);
rootElement.appendChild(notifierElement);

export let currentUser = {};

// export const mockUser = {
//   login: '',
//   isAuthorised: false,
// };

// const pagesConfig = {
//   pages: {
//     films: {
//       text: 'Подборка фильмов',
//       href: '/main',
//       render: renderMainPage,
//     },
//     login: {
//       text: 'Авторизация',
//       href: '/auth',
//       render: renderAuthPage,
//     },
//     signup: {
//       text: 'Регистрация',
//       href: '/register',
//       render: renderRegPage,
//     },
//   },
// };

const pagesConfig = setPagesConfig(
  currentUser,
  renderMainPage,
  renderAuthPage,
  renderRegPage,
);

export const checkAuth = async () => {
  try {
    const response = await apiClient.get({
      path: 'auth/session',
    });

    currentUser = response.user_data;
    console.log(currentUser);
    // TODO: Добавить в finally
    updatePagesConfig(pagesConfig, currentUser);
  } catch {
    currentUser = {};
    updatePagesConfig(pagesConfig, currentUser);
    throw new Error('hello');
  }
};

// checkAuth();

function updatePagesConfig(config, currentUser) {
  config.pages.login.isAvailable = !currentUser.username;
  config.pages.signup.isAvailable = !currentUser.username;
  renderHeader();
}

const header = new Header(headerElement, pagesConfig);
const mainPage = new MainPage(pageElement);
const authPage = new AuthPage(pageElement);
const regPage = new RegPage(pageElement);

//TEST

// function imitateLogin() {
//   const logImitatorButton = document.getElementById('inin');

//   logImitatorButton.addEventListener('click', () => {
//     mockUser.isAuthorised = true;
//     mockUser.login = 'Tamik';

//     updatePagesConfig(pagesConfig, mockUser);
//     // renderHeader();
//   });
// }
// function imitateExit() {
//   const logoutImitatorButton = document.getElementById('exit-button');
//   logoutImitatorButton.addEventListener('click', () => {
//     console.log('aaaaaaa');
//     mockUser.isAuthorised = false;
//     updatePagesConfig(pagesConfig, mockUser);
//     renderHeader();
//   });
// }

function renderHeader() {
  header.render();

  headerElement.addEventListener('click', (e) => {
    const { target } = e;

    if (
      target.tagName.toLowerCase() === 'a' ||
      target instanceof HTMLAnchorElement
    ) {
      console.log('9999');
      e.preventDefault();
      goToPage(target);
    }
  });

  //TEST
  // imitateLogin();
  // imitateExit();
}

function renderMainPage() {
  mainPage.render();
}
function renderAuthPage() {
  authPage.render();
}
function renderRegPage() {
  regPage.render();
}

export function goToPage(headerLinkElement) {
  if (
    headerLinkElement.dataset.section ==
    header.state.activeHeaderLink?.dataset.section
  ) {
    return;
  }

  pageElement.innerHTML = '';

  Object.values(header.state.navElements).forEach((el) =>
    el.classList.remove('active'),
  );
  header.state.activeHeaderLink?.classList.remove('active');
  headerLinkElement.classList.add('active');
  header.state.activeHeaderLink = headerLinkElement;
  pagesConfig.pages[headerLinkElement.dataset.section].render();
}

renderMainPage();
// renderHeader();

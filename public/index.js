import { MainPage } from './pages/MainPage/MainPage.js';
import { AuthPage } from './pages/AuthPage/AuthPage.js';

import './index.css';
import { Header } from './components/Header/Header.js';
import { RegPage } from './pages/RegPage/RegPage.js';

const rootElement = document.getElementById('root');
const headerElement = document.createElement('header');
const pageElement = document.createElement('main');

rootElement.appendChild(headerElement);
rootElement.appendChild(pageElement);

// Надо будет унести в отдельный файл
const config = {
  pages: {
    films: {
      text: 'Подборка фильмов',
      href: '/main',
      render: renderMainPage,
    },
    login: {
      text: 'Авторизация',
      href: '/auth',
      render: renderAuthPage,
    },
    signup: {
      text: 'Регистрация',
      href: '/register',
      render: renderRegPage,
    },
  },
};

const header = new Header(headerElement, config);
const mainPage = new MainPage(pageElement);
const authPage = new AuthPage(pageElement);
const regPage = new RegPage(pageElement);

function renderHeader() {
  header.render();
  headerElement.addEventListener('click', (e) => {
    const { target } = e;

    if (
      target.tagName.toLowerCase() === 'a' ||
      target instanceof HTMLAnchorElement
    ) {
      console.log(target);
      e.preventDefault();
      goToPage(target);
    }
  });
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
  config.pages[headerLinkElement.dataset.section].render();
}

renderHeader();
renderMainPage();

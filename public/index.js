import { MainPage } from './pages/MainPage/MainPage.js';
import { AuthPage } from './pages/AuthPage/AuthPage.js';

import './index.css';
import { RegForm } from './components/RegForm/RegForm.js';
import { Header } from './components/Header/Header.js';
import { AuthForm } from './components/AuthForm/AuthForm.js';
import { RegPage } from './pages/RegPage/RegPage.js';

const rootElement = document.getElementById('root');
const headerElement = document.createElement('header');
const authFormElement = document.createElement('div');
const regFormElement = document.createElement('div');
const pageElement = document.createElement('main');
// const pageWrapperElement = document.createElement('div');
// pageWrapperElement.className = 'page__wrapper';

// rootElement.appendChild(menuElement);
rootElement.appendChild(headerElement);
rootElement.appendChild(pageElement);
// pageElement.appendChild(pageWrapperElement);

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
      e.preventDefault();
      console.log(target);
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
  pageElement.innerHTML = '';
  console.log(headerLinkElement);

  // на первом рэндере activeHeaderLink в header остается пустым, поэтому класс active не пропадает, пока мы не перейдем на главную еще раз
  Object.values(header.state.navElements).forEach((el) =>
    el.classList.remove('active')
  );

  header.state.activeHeaderLink?.classList.remove('active');
  headerLinkElement.classList.add('active');
  header.state.activeHeaderLink = headerLinkElement;
  config.pages[headerLinkElement.dataset.section].render();

  console.log(headerLinkElement.dataset.section);
}

// renderMenu();
renderHeader();
renderMainPage();
// renderAuthPage();
// renderAuthForm();
// renderRegForm();

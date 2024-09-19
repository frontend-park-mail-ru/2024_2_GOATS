import { MainPage } from './pages/MainPage/MainPage.js';
import './index.css';
import { RegForm } from './components/RegForm/RegForm.js';
import { Header } from './components/Header/Header.js';
import { AuthForm } from './components/AuthForm/AuthForm.js';

const rootElement = document.getElementById('root');
const menuElement = document.createElement('aside');
const headerElement = document.createElement('header');
const authFormElement = document.createElement('div');
const regFormElement = document.createElement('div');
const pageElement = document.createElement('main');
const pageWrapperElement = document.createElement('div');
pageWrapperElement.className = 'page__wrapper';

// rootElement.appendChild(menuElement);
rootElement.appendChild(headerElement);
rootElement.appendChild(pageElement);
pageElement.appendChild(pageWrapperElement);

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
      render: renderAuthForm,
    },
    signup: {
      text: 'Регистрация',
      href: '/register',
      render: renderRegForm,
    },
  },
};

// const menu = new Menu(menuElement, config);
const header = new Header(headerElement, config);
const authForm = new AuthForm(pageWrapperElement);
const regForm = new RegForm(pageWrapperElement);
const mainPage = new MainPage(pageWrapperElement);

function renderMenu() {
  menu.render();
  menuElement.addEventListener('click', (e) => {
    const { target } = e;

    if (
      target.tagName.toLowerCase() === 'a' ||
      target instanceof HTMLAnchorElement
    ) {
      e.preventDefault();
    }
  });
}

function renderHeader() {
  header.render();
  headerElement.addEventListener('click', (e) => {
    const { target } = e;

    if (
      target.tagName.toLowerCase() === 'a' ||
      target instanceof HTMLAnchorElement
    ) {
      e.preventDefault();
      goToPage(target);
    }
  });
}

function renderAuthForm() {
  authForm.render();
}

function renderRegForm() {
  regForm.render();
}
function renderMainPage() {
  mainPage.render();
}

function goToPage(headerLinkElement) {
  pageWrapperElement.innerHTML = '';

  header.state.activeHeaderLink?.classList.remove('active');
  headerLinkElement.classList.add('active');
  header.state.activeHeaderLink = headerLinkElement;
  config.pages[headerLinkElement.dataset.section].render();

  console.log(headerLinkElement.dataset.section);
}

// renderMenu();
renderHeader();
renderMainPage();
// renderAuthForm();
// renderRegForm();

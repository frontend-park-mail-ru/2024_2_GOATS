import { MainPage } from './pages/MainPage/MainPage.js';
import './index.css';
import { RegForm } from './components/RegForm/RegForm.js';
import { Header } from './components/Header/Header.js';

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

const mainPage = new MainPage(pageWrapperElement);

const renderMainPage = () => {
  mainPage.render();
};

renderMainPage();

// Надо будет унести в отдельный файл
const config = {
  pages: {
    films: {
      text: 'Подборка фильмов',
      href: '/main',
      render: () => {
        alert('MAIN PAGE');
      },
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
const authForm = new AuthForm(pageElement);
const regForm = new RegForm(pageElement);

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

function goToPage(headerLinkElement) {
  pageElement.innerHTML = '';

  header.state.activeHeaderLink?.classList.remove('active');
  headerLinkElement.classList.add('active');
  header.state.activeHeaderLink = headerLinkElement;
  config.pages[headerLinkElement.dataset.section].render();
}

// renderMenu();
renderHeader();
// renderAuthForm();
renderRegForm();

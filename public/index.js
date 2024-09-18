import { Menu } from './components/Menu/Menu.js';
import { AuthForm } from './components/AuthForm/AuthForm.js';
import './index.css';
import { RegForm } from './components/RegForm/RegForm.js';
import { Header } from './components/Header/Header.js';

console.log('lolkek');
const rootElement = document.getElementById('root');
const menuElement = document.createElement('aside');
const headerElement = document.createElement('header');
const authFormElement = document.createElement('div');
const regFormElement = document.createElement('div');
const pageElement = document.createElement('main');

// rootElement.appendChild(menuElement);
rootElement.appendChild(headerElement);

// pageElement.appendChild(authFormElement);
// pageElement.appendChild(regFormElement);
rootElement.appendChild(pageElement);

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
  console.log(config.pages[headerLinkElement.dataset.section].render);
  config.pages[headerLinkElement.dataset.section].render();

  // pageElement.appendChild(element);
}

// renderMenu();
renderHeader();
// renderAuthForm();
// renderRegForm();

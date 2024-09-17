import { Menu } from './components/Menu/menu.js';
import './index.css';

console.log('lolkek');
const rootElement = document.getElementById('root');
const menuElement = document.createElement('aside');
const pageElement = document.createElement('main');

rootElement.appendChild(menuElement);
rootElement.appendChild(pageElement);

const config = {
  menu: {
    films: {
      text: 'Подборка фильмов',
      render: () => {},
    },
    login: {
      text: 'Авторизация',
      render: () => {},
    },
    signup: {
      text: 'Регистрация',
      render: () => {},
    },
  },
};

const menu = new Menu(menuElement, config);

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

renderMenu();

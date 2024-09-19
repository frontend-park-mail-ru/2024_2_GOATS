import { MainPage } from './pages/MainPage/MainPage.js';
import './index.css';

const rootElement = document.getElementById('root');
const pageElement = document.createElement('main');
const pageWrapperElement = document.createElement('div');
pageWrapperElement.className = 'page__wrapper';

rootElement.appendChild(pageElement);
pageElement.appendChild(pageWrapperElement);

const mainPage = new MainPage(pageWrapperElement);

const renderMainPage = () => {
  mainPage.render();
};

renderMainPage();

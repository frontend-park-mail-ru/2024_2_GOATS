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
export let isAuthorised = false;

const pagesConfig = setPagesConfig(
  currentUser,
  renderMainPage,
  renderAuthPage,
  renderRegPage,
);

/**
 * check if user authorised using cookies
 * @param {}
 * @returns {}
 */
export const checkAuth = async () => {
  try {
    const response = await apiClient.get({
      path: 'auth/session',
    });

    currentUser = response.user_data;
  } catch {
    currentUser = {};
  } finally {
    updatePagesConfig(pagesConfig, currentUser);
  }
};

/**
 * check if user authorised using cookies
 * @param {Object} config - current pages config
 * @param {Object} currentUser - current user
 * @returns {}
 */
function updatePagesConfig(config, currentUser) {
  config.pages.login.isAvailable = !currentUser.username;
  config.pages.signup.isAvailable = !currentUser.username;
  renderHeader();
}

const mainPage = new MainPage(pageElement);
const authPage = new AuthPage(pageElement);
const regPage = new RegPage(pageElement);
const header = new Header(headerElement, pagesConfig);

/**
 * rendering header
 * @param {}
 * @returns {}
 */
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

function renderMainPage() {
  mainPage.render();
}
function renderAuthPage() {
  authPage.render();
}
function renderRegPage() {
  regPage.render();
}

/**
 * rerender header and page after navigation action
 * @param {HTMLElement} headerLinkElement - nav-link that was clicked
 * @returns {}
 */
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

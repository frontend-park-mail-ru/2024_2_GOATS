import template from './Header.hbs';
import { apiClient } from '../../modules/ApiClient';
import { ConfirmModal } from '../ConfirmModal/ConfirmModal';
import { PageConfig } from 'types/pages';
import { userStore } from 'store/UserStore';
import Handlebars from 'handlebars';
import { Actions } from 'flux/Actions';
import { router } from 'modules/Router';

function clickHandler(event: MouseEvent, config: any) {
  let targetElement: HTMLElement;

  // При клике на иконку профиля event.target - img
  if (event.target instanceof HTMLImageElement) {
    targetElement = (event.target as HTMLImageElement).closest(
      'a',
    ) as HTMLElement;
  } else if (event.target instanceof HTMLAnchorElement) {
    targetElement = event.target as HTMLElement;
  } else {
    return;
  }

  if (!targetElement) return;

  event.preventDefault();
  const targetId = targetElement.id;

  targetElement.classList.add('active');

  let targetConfig;
  for (let element in config.pages) {
    if (config.pages[element].id === targetId) {
      targetConfig = config.pages[element];
      break;
    }
  }

  if (targetConfig) {
    targetConfig.render();
  }
}

export class Header {
  #parent;
  #config: PageConfig;
  #activeLink;
  #handler;

  constructor(config: PageConfig, currentUrl: string) {
    this.#parent = document.getElementsByTagName('header')[0];
    this.#config = config;
    this.#activeLink = currentUrl;
    this.#handler = (event: MouseEvent) => {
      clickHandler(event, this.#config);
    };
  }

  get getConfig(): PageConfig {
    return this.#config;
  }

  toggleSearch() {
    const searchBar = document.getElementById('search-bar') as HTMLElement;
    const searchInput = document.getElementById(
      'search-bar-input',
    ) as HTMLElement;
    const searchButton = document.getElementById(
      'search-bar-search',
    ) as HTMLElement;
    const closeButton = document.getElementById(
      'search-bar-close',
    ) as HTMLElement;

    searchButton.addEventListener('click', () => {
      searchBar.classList.add('active');
      setTimeout(() => {
        searchInput.focus();
      }, 100);
    });
    closeButton.addEventListener('click', () => {
      searchBar.classList.remove('active');
    });
  }

  render() {
    this.renderTemplate();
  }

  get items() {
    return Object.entries(this.getConfig.pages);
  }

  handleLogoClick() {
    const logo = document.getElementById('header-logo') as HTMLElement;
    logo.addEventListener('click', () => {
      router.go('/');
    });
  }

  async logout() {
    try {
      await apiClient.post({
        path: 'auth/logout',
        body: {},
      });
      router.go('/');
    } catch {
      userStore.checkAuth();
      throw new Error('logout error');
    } finally {
      userStore.checkAuth();
    }
  }

  renderTemplate() {
    this.#parent.innerHTML = '';
    const items = this.items.map(([key, { text, href, isAvailable, id }]) => {
      let className = '';

      if (href === this.#activeLink && href != '/profile') {
        className += 'active';
      }

      return { key, text, href, className, id, isAvailable };
    });

    const user = userStore.getUser();

    this.#parent.innerHTML = template({
      navItems: items.filter((item) => item.id != 'header-profile'),
      isUserAuth: userStore.getUserAuthStatus(),
      currentUserAvatar: user.avatar.replace(/ /g, '%20'),
      currentUsername: user.username,
      // currentUserAvatar: encodeURIComponent(user.avatar), // не работает
      profileItem: items.find((item) => item.id == 'header-profile'),
    });

    document.getElementById('header')?.addEventListener('click', this.#handler);
    this.handleLogoClick();
    this.toggleSearch();
  }
}

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

  render() {
    this.renderTemplate();
  }

  get items() {
    return Object.entries(this.getConfig.pages);
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

  // onExitClick() {
  //   if (userStore.getUser().isAuth) {
  //     const modal = new ConfirmModal('Вы уверены, что хотите выйти?', () => {
  //       this.logout();
  //     });
  //     const exitButton = document.getElementById('exit-button') as HTMLElement;
  //     exitButton.addEventListener('click', () => {
  //       modal.render();
  //     });
  //   }
  // }

  renderTemplate() {
    this.#parent.innerHTML = '';
    console.log(this.#activeLink);
    const items = this.items.map(([key, { text, href, isAvailable, id }]) => {
      let className = '';

      if (href === this.#activeLink && href != '/profile') {
        className += 'active';
      }

      return { key, text, href, className, id, isAvailable };
    });

    const user = userStore.getUser();
    console.log(items);
    console.log(items.find((item) => item.id == 'header-profile'));
    this.#parent.innerHTML = template({
      navItems: items.filter((item) => item.id != 'header-profile'),
      isUserAuth: userStore.getUserAuthStatus(),
      currentUser: user,
      profileItem: items.find((item) => item.id == 'header-profile'),
    });

    document.getElementById('header')?.addEventListener('click', this.#handler);

    // this.onExitClick();
  }
}

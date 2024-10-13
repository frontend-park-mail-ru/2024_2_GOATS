import template from './Header.hbs';
import { apiClient } from '../../modules/ApiClient';
import { ConfirmModal } from '../ConfirmModal/ConfirmModal';
import { PageConfig } from 'types/pages';
import { userStore } from 'store/UserStore';

function clickHandler(event: MouseEvent, config: any) {
  if (event.target instanceof HTMLAnchorElement) {
    event.preventDefault();
    const targetId = event.target.id;

    const a = document.getElementById(targetId);
    a?.classList.add('active');

    let target;
    for (let element in config.pages) {
      if (config.pages[element].id === targetId) {
        target = config.pages[element];
      }
    }
    target.render();
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
    } catch {
      userStore.checkAuth(false);
      throw new Error('logout error');
    }
  }

  onExitClick() {
    if (userStore.getUser().isAuth) {
      const modal = new ConfirmModal('Вы уверены, что хотите выйти?', () => {
        this.logout();
      });
      const exitButton = document.getElementById('exit-button') as HTMLElement;
      exitButton.addEventListener('click', () => {
        modal.render();
      });
    }
  }

  renderTemplate() {
    this.#parent.innerHTML = '';
    console.log(this.#activeLink);
    const items = this.items.map(([key, { text, href, isAvailable, id }]) => {
      let className = '';

      if (href === this.#activeLink) {
        className += 'active';
      }

      return { key, text, href, className, id, isAvailable };
    });

    const user = userStore.getUser();
    this.#parent.innerHTML = template({ items: items, currentUser: user });

    document.getElementById('header')?.addEventListener('click', this.#handler);

    this.onExitClick();
  }
}

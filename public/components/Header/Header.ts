import template from './Header.hbs';
// import { currentUser } from '../..';
// import { currentUser } from 'modules/RouterHandler';
import { apiClient } from '../../modules/ApiClient';
// import { checkAuth } from '../..';
// import { checkAuth } from 'modules/RouterHandler';
import { ConfirmModal } from '../ConfirmModal/ConfirmModal';
import { PageConfig } from 'types/pages';
import { userStore } from 'flux/UserStore';

type State = {
  activeHeaderLink: HTMLElement | null;
  navElements: Record<string, HTMLElement>;
};

export function clickHandler(event: MouseEvent, config: any) {
  if (event.target instanceof HTMLAnchorElement) {
    event.preventDefault();
    const targetId = event.target.id;
    console.log(targetId);
    let target;
    for (let element in config.pages) {
      if (config.pages[element].id === targetId) {
        target = config.pages[element];
      }
    }
    console.log(target);
    target.render(target.href, '', target.parent);
  }
}

export class Header {
  #parent;
  #config: PageConfig;
  // #state: State;

  constructor(config: PageConfig) {
    this.#parent = document.getElementsByTagName('header')[0];
    this.#config = config;
    const handler = (event: MouseEvent) => {
      clickHandler(event, this.#config);
    };
    this.#parent.addEventListener('click', handler);
    // this.#state = {
    //   activeHeaderLink: null,
    //   navElements: {},
    // };
  }

  // get state(): State {
  //   return this.#state;
  // }

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
      // checkAuth();
    } catch {
      throw new Error('logout error');
    }
  }

  onExitClick() {
    // if (currentUser.username) {
    //   const modal = new ConfirmModal('Вы уверены, что хотите выйти?', () => {
    //     this.logout();
    //   });
    //   const exitButton = document.getElementById('exit-button') as HTMLElement;
    //   exitButton.addEventListener('click', () => {
    //     modal.render();
    //   });
    // }
  }

  renderTemplate() {
    const items = this.items.map(
      ([key, { text, href, isAvailable, id }], index) => {
        let className = '';
        if (index === 0) {
          className += 'active';
        }

        return { key, text, href, className, id, isAvailable };
      },
    );

    // this.#parent.innerHTML = template({ items, currentUser });
    // this.#parent.innerHTML = template({ items, {}});
    // const HeaderEl = document.getElementsByTagName('header')[0];
    this.#parent.innerHTML = template({ items });

    // HeaderEl.querySelectorAll('a').forEach((element) => {
    //   if (element.dataset.section) {
    //     this.#state.navElements[element.dataset.section] = element;
    //   }
    // });
    this.onExitClick();
  }
}

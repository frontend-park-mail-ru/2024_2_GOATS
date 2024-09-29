import template from './Header.hbs';
import { currentUser } from '../..';
import { apiClient } from '../../modules/ApiClient';
import { checkAuth } from '../..';
import { ConfirmModal } from '../ConfirmModal/ConfirmModal';

export class Header {
  #parent;
  #config;

  constructor(parent, config) {
    this.#parent = parent;
    this.#config = config;

    this.state = {
      activeHeaderLink: null,
      navElements: {},
    };
  }

  /**
   * Get header config
   * @param {}
   * @returns {}
   */
  get getConfig() {
    return this.#config;
  }

  render() {
    this.renderTemplate();
  }

  /**
   * Get header items
   * @param {}
   * @returns {}
   */
  get items() {
    return Object.entries(this.getConfig.pages);
  }

  /**
   * Send logout request
   * @param {}
   * @returns {Promise<Object>} - response from the API
   */
  async logout() {
    try {
      await apiClient.post({
        path: 'auth/logout',
      });
      checkAuth();
    } catch {
      throw new Error('logout error');
    }
  }

  /**
   * Add listener on exit button
   * @param {}
   * @returns {}
   */
  onExitClick() {
    if (currentUser.username) {
      const modal = new ConfirmModal('Вы уверены, что хотите выйти?', () => {
        this.logout();
      });

      const exitButton = document.getElementById('exit-button');

      exitButton.addEventListener('click', () => {
        modal.render();
      });
    }
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

    this.#parent.innerHTML = template({ items, currentUser });
    this.#parent.querySelectorAll('a').forEach((element) => {
      this.state.navElements[element.dataset.section] = element;
    });
    this.onExitClick();
  }
}

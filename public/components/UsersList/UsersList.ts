import template from './UsersList.hbs';
import { UserNew } from 'types/user';

export class UsersList {
  #parent;
  #users;

  constructor(parent: HTMLElement, users: UserNew[]) {
    this.#parent = parent;
    this.#users = users;
  }

  render() {
    this.renderTemplate();
  }

  renderTemplate() {
    if (this.#parent) {
      this.#parent.innerHTML = template({ users: this.#users });
    }
  }
}

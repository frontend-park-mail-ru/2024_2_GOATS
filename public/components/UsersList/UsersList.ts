import template from './UsersList.hbs';
import { UserNew } from 'types/user';

export class UsersList {
  #parent;
  #users;

  constructor(parent: HTMLElement, users: UserNew[]) {
    this.#parent = parent;
    this.#users = this.#getUniqueUsers(users);
  }

  #getUniqueUsers(users: UserNew[]) {
    const seenUsernames = new Set<string>();
    const uniqueUsers: UserNew[] = [];

    for (const user of users) {
      if (!seenUsernames.has(user.username)) {
        seenUsernames.add(user.username);
        uniqueUsers.push(user);
      }
    }

    return uniqueUsers;
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

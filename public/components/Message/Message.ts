import { User } from 'types/user';
import template from './Message.hbs';

export class Message {
  #parent;
  #user;
  #text;
  #isCurrentUser;

  constructor(
    parent: HTMLDivElement,
    user: User,
    text: string,
    isCurrentUser: boolean,
  ) {
    this.#parent = parent;
    this.#user = user;
    this.#text = text;
    this.#isCurrentUser = isCurrentUser;
  }

  render() {
    this.renderTemplate();
  }

  renderTemplate() {
    this.#parent.insertAdjacentHTML(
      'beforeend',
      template({
        user: this.#user,
        text: this.#text,
        isCurrentUser: this.#isCurrentUser,
      }),
    );
  }
}

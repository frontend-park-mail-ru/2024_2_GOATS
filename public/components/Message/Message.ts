import { User } from 'types/user';
import template from './Message.hbs';

export class Message {
  #parent;
  #user;
  #text;

  constructor(parent: HTMLDivElement, user: User, text: string) {
    this.#parent = parent;
    this.#user = user;
    this.#text = text;
  }

  render() {
    this.renderTemplate();
  }

  renderTemplate() {
    this.#parent.insertAdjacentHTML(
      'beforeend',
      template({ user: this.#user, text: this.#text }),
    );
  }
}

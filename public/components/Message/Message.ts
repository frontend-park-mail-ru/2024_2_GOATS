import { User } from 'types/user';
import template from './Message.hbs';

export class Message {
  #parent;
  #user;
  #text;
  #isCurrentUser;

  constructor(params: {
    parent: HTMLDivElement;
    user: User;
    text: string;
    isCurrentUser: boolean;
  }) {
    this.#parent = params.parent;
    this.#user = params.user;
    this.#text = params.text;
    this.#isCurrentUser = params.isCurrentUser;
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

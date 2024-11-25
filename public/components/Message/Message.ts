import { User } from 'types/user';
import template from './Message.hbs';
import { MessageData } from 'types/room';

export class Message {
  #parent;
  #message;
  #isCurrentUser;

  constructor(params: {
    parent: HTMLDivElement;
    message: MessageData;
    isCurrentUser: boolean;
  }) {
    this.#parent = params.parent;
    this.#message = params.message;
    this.#isCurrentUser = params.isCurrentUser;
  }

  render() {
    this.renderTemplate();
  }

  renderTemplate() {
    this.#parent.insertAdjacentHTML(
      'beforeend',
      template({
        message: this.#message,
        isCurrentUser: this.#isCurrentUser,
      }),
    );
  }
}

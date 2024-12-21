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
    const userAvatar = this.#message.avatar;
    this.#parent.insertAdjacentHTML(
      'beforeend',
      template({
        userAvatar: userAvatar.replace(/ /g, '%20'),
        message: this.#message,
        isCurrentUser: this.#isCurrentUser,
      }),
    );
  }
}

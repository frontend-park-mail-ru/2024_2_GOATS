import template from './PersonCard.hbs';
import { Person } from 'types/movie';

export class PersonCard {
  #parent;
  #person;

  constructor(parent: HTMLElement, person: Person) {
    this.#parent = parent;
    this.#person = person;
  }

  render() {
    this.renderTemplate();
  }

  renderTemplate() {
    this.#parent.insertAdjacentHTML(
      'beforeend',
      template({ person: this.#person }),
    );
  }
}

import template from './PersonCard.hbs';
import { Person } from 'types/movie';

export class PersonCard {
  #parent;
  #person;
  #onCardClick;

  constructor(parent: HTMLElement, person: Person, onCardClick: () => void) {
    this.#parent = parent;
    this.#person = person;
    this.#onCardClick = onCardClick;
  }

  render() {
    this.renderTemplate();
  }

  handleCardClick() {
    const card = document.getElementById(
      `person-card-${this.#person.id}`,
    ) as HTMLElement;
    card.addEventListener('click', this.#onCardClick);
  }

  renderTemplate() {
    this.#parent.insertAdjacentHTML(
      'beforeend',
      template({ person: this.#person }),
    );

    this.handleCardClick();
  }
}

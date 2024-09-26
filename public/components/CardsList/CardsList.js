import { Card } from '../Card/Card';
import template from './CardsList.hbs';

export class CardsList {
  #parent;
  #movies;
  #id;

  constructor(parent, movies, id) {
    this.#parent = parent;
    this.#movies = movies;
    this.#id = id;
  }

  render() {
    this.renderTemplate();
  }

  renderTemplate() {
    this.#parent.insertAdjacentHTML('beforeend', template({ id: this.#id }));

    const cardsList = document.getElementById(`cards-list-${this.#id}`);

    this.#movies.forEach((movie) => {
      const card = new Card(cardsList, movie);
      card.render();
    });
  }
}

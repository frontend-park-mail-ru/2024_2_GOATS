import { Card } from '../Card/Card';
import template from './CardsList.hbs';
import { Movie } from 'types/movie';

export class CardsList {
  #parent;
  #movies;
  #id;

  constructor(parent: HTMLElement, movies: Movie[], id: number) {
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

    if (cardsList) {
      this.#movies.forEach((movie) => {
        const card = new Card(cardsList, movie, () => {
          console.log('card clicked');
        });
        card.render();
      });
    }
  }
}

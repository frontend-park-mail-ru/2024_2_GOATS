import { router } from 'modules/Router';
import { Card } from '../Card/Card';
import template from './CardsList.hbs';
import { Movie } from 'types/movie';
import { router } from 'modules/Router';

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
        const card = new Card(cardsList, movie, () =>
          router.go('/movie', movie.id),
        );
        card.render();
      });
    }
  }
}

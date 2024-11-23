import { router } from 'modules/Router';
import { Card } from '../Card/Card';
import template from './CardsList.hbs';
import { Movie } from 'types/movie';

export class CardsList {
  #parent;
  #movies;
  #id;

  constructor(parent: HTMLElement, id: number, movies?: Movie[]) {
    this.#parent = parent;
    this.#id = id;
    this.#movies = movies;
  }

  render() {
    this.renderTemplate();
  }

  renderTemplate() {
    this.#parent.insertAdjacentHTML('beforeend', template({ id: this.#id }));

    const cardsList = document.getElementById(`cards-list-${this.#id}`);

    if (cardsList) {
      if (this.#movies) {
        this.#movies?.forEach((movie) => {
          const card = new Card(cardsList, movie, () =>
            router.go('/movie', movie.id),
          );
          card.render();
        });
      } else {
        for (let i = 0; i < 10; ++i) {
          cardsList.classList.add('cards-list-skeleton');
          const card = new Card(cardsList, null, () => {});
          card.render();
        }
      }
    }
  }
}

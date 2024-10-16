import template from './Card.hbs';
import { Movie } from 'types/movie';

export class Card {
  #parent;
  #movie;
  #onCardClick;

  constructor(parent: HTMLElement, movie: Movie, onCardClick: () => void) {
    this.#parent = parent;
    this.#movie = movie;
    this.#onCardClick = onCardClick;
  }

  render() {
    this.renderTemplate();
  }

  handleCardClick() {
    const card = document.getElementById(
      `movie-card-${this.#movie.id}`,
    ) as HTMLElement;
    card.addEventListener('click', this.#onCardClick);
  }

  renderTemplate() {
    this.#parent.insertAdjacentHTML(
      'beforeend',
      template({ movie: this.#movie }),
    );

    this.handleCardClick();
  }
}

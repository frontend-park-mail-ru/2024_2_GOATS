import template from './MovieBigCard.hbs';
import skeletonTemplate from './MovieBigCardSkeleton.hbs';
import { Movie } from 'types/movie';

export class MovieBigCard {
  #parent;
  #movie;
  #onCardClick;
  #cardId;

  constructor(
    parent: HTMLElement,
    movie: Movie | null,
    onCardClick: () => void,
    cardId?: number,
  ) {
    this.#parent = parent;
    this.#movie = movie;
    this.#onCardClick = onCardClick;
    this.#cardId = cardId;
  }

  render() {
    this.renderTemplate();
  }

  handleCardClick() {
    const card = document.getElementById(
      `movie-big-card-${this.#movie ? this.#movie.id : this.#cardId && this.#cardId}`,
    ) as HTMLElement;
    card.addEventListener('click', this.#onCardClick);
  }

  renderTemplate() {
    if (!this.#movie) {
      this.#parent.insertAdjacentHTML('beforeend', skeletonTemplate());
    } else {
      this.#movie.releaseDate = this.#movie.releaseDate.split(' ')[2];
      this.#parent.insertAdjacentHTML(
        'beforeend',
        template({ movie: this.#movie }),
      );

      this.handleCardClick();
    }
  }
}

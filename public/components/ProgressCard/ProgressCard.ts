import template from './ProgressCard.hbs';
import { MovieSaved } from 'types/movie';

export class ProgressCard {
  #parent;
  #movie;
  #onCardClick;
  #cardId;

  constructor(
    parent: HTMLElement,
    movie: MovieSaved | null,
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
      `progress-card-${this.#movie ? this.#movie.id : this.#cardId && this.#cardId}`,
    ) as HTMLElement;
    card.addEventListener('click', this.#onCardClick);
  }

  calculateProgressLineWidth() {
    let percentage = 0;
    if (this.#movie) {
      percentage = (this.#movie?.timeCode / this.#movie?.duration) * 100;
    }

    const progressLine = document.querySelector(
      '.progress-card__image_progress_line',
    ) as HTMLDivElement;
    progressLine.style.setProperty(
      '--progress-last-movie-value',
      `${percentage}%`,
    );
  }

  renderTemplate() {
    this.#parent.insertAdjacentHTML(
      'beforeend',
      template({ movie: this.#movie }),
    );

    this.calculateProgressLineWidth();
    this.handleCardClick();
  }
}

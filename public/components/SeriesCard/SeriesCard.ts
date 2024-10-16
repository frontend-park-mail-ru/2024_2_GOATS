import template from './SeriesCard.hbs';
import { Series } from 'types/movie';

export class SeriesCard {
  #parent;
  #series;
  #onCardClick;

  constructor(parent: HTMLElement, series: Series, onCardClick: () => void) {
    this.#parent = parent;
    this.#series = series;
    this.#onCardClick = onCardClick;
  }

  render() {
    this.renderTemplate();
  }

  handleCardClick() {
    const card = document.getElementById(
      `series-card-${this.#series.id}`,
    ) as HTMLElement;
    card.addEventListener('click', this.#onCardClick);
  }

  renderTemplate() {
    this.#parent.insertAdjacentHTML(
      'beforeend',
      template({ series: this.#series }),
    );

    this.handleCardClick();
  }
}

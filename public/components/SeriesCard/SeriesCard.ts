import template from './SeriesCard.hbs';
import { Series } from 'types/movie';

export class SeriesCard {
  #parent;
  #series;

  constructor(parent: HTMLElement, series: Series) {
    this.#parent = parent;
    this.#series = series;
  }

  render() {
    this.renderTemplate();
  }

  renderTemplate() {
    this.#parent.insertAdjacentHTML(
      'beforeend',
      template({ series: this.#series }),
    );
  }
}

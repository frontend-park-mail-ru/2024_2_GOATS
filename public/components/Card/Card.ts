import template from './Card.hbs';
import { Movie } from 'types/movie';

export class Card {
  #parent;
  #movie;

  constructor(parent: HTMLElement, movie: Movie) {
    this.#parent = parent;
    this.#movie = movie;
  }

  render() {
    this.renderTemplate();
  }

  renderTemplate() {
    this.#parent.insertAdjacentHTML(
      'beforeend',
      template({ movie: this.#movie }),
    );
  }
}

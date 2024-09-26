import template from './Card.hbs';

export class Card {
  #parent;
  #movie;

  constructor(parent, movie) {
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

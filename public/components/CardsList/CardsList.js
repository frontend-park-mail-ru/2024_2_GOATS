import { Card } from '../Card/Card';

export class CardsList {
  #parent;
  #movies;

  constructor(parent, movies) {
    this.#parent = parent;
    this.#movies = movies;
  }

  render() {
    this.renderTemplate();
  }

  renderTemplate() {
    const template = Handlebars.templates['CardsList.hbs'];

    this.#parent.insertAdjacentHTML('beforeend', template());

    const cardsList = document.getElementById('cards-list');

    this.#movies.forEach((movie) => {
      const card = new Card(cardsList, movie);
      card.render();
    });
  }
}

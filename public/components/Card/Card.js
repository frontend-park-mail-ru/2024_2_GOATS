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
    const template = Handlebars.templates['Card.hbs'];
    console.log(this.#movie);
    this.#parent.innerHTML = template({ movie: this.#movie });
  }
}

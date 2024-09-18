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
    const cardHTML = template({ movie: this.#movie });
    const tempDiv = document.createElement('div'); // TODO: проверить
    tempDiv.innerHTML = cardHTML;
    this.#parent.appendChild(tempDiv.firstElementChild);
  }
}

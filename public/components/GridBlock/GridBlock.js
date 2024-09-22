export class GridBlock {
  #parent;
  #movies;
  //   #id;

  constructor(parent, movies) {
    this.#parent = parent;
    this.#movies = movies;
    // this.#id = id;
  }

  render() {
    this.renderTemplate();
  }

  getTop() {
    return this.#movies.slice(0, 3);
  }

  renderTemplate() {
    const template = Handlebars.templates['GridBlock.hbs'];
    this.#parent.innerHTML = template({ items: this.getTop() });
  }
}

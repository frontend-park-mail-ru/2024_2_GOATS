import { Movie } from 'types/movie';
import template from './GridBlock.hbs';

export class GridBlock {
  #parent;
  #movies;
  #blockTitle;

  constructor(parent: HTMLElement, movies: Movie[], blockTitle: string) {
    this.#parent = parent;
    this.#movies = movies;
    this.#blockTitle = blockTitle;
  }

  render() {
    this.renderTemplate();
  }

  /**
   * get first three objects for displaying
   * @param {}
   * @returns {}
   */
  getTop() {
    return this.#movies.slice(0, 3);
  }

  renderTemplate() {
    this.#parent.innerHTML = template({
      items: this.getTop(),
      title: this.#blockTitle,
    });
  }
}

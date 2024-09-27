import { CategoryPage } from '../../pages/CategoryPage/CategoryPage';
import template from './GridBlock.hbs';

export class GridBlock {
  #parent;
  #movies;
  #blockTitle;

  constructor(parent, movies, blockTitle) {
    this.#parent = parent;
    this.#movies = movies;
    this.#blockTitle = blockTitle;
  }

  render() {
    this.renderTemplate();
    this.onMoreClick();
  }

  getTop() {
    return this.#movies.slice(0, 3);
  }

  /**
   * Navigate to category page
   * @param {}
   * @returns {}
   */
  onMoreClick() {
    const more = document.getElementById('grid-block-header-more');
    const main = document.querySelector('main');
    more.addEventListener('click', () => {
      main.innerHTML = '';
      const category = new CategoryPage(main, this.#blockTitle);
      category.render();
    });
  }

  renderTemplate() {
    this.#parent.innerHTML = template({
      items: this.getTop(),
      title: this.#blockTitle,
    });
  }
}

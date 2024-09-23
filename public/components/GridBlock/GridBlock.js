import { CategoryPage } from '../../pages/CategoryPage/CategoryPage';

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

  onMoreClick() {
    const more = document.getElementById('grid-block-header-more');
    const mainPage = document.getElementById('main-page');
    more.addEventListener('click', () => {
      console.log('aaa');
      mainPage.innerHTML = '';
      const category = new CategoryPage(mainPage, this.#blockTitle);
      category.render();
    });
  }

  renderTemplate() {
    const template = Handlebars.templates['GridBlock.hbs'];
    this.#parent.innerHTML = template({
      items: this.getTop(),
      title: this.#blockTitle,
    });
  }
}

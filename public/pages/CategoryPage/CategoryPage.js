import { CardsList } from '../../components/CardsList/CardsList';
import { apiClient } from '../../modules/ApiClient';

export class CategoryPage {
  #parent;
  #movies;
  #pageTitle;

  constructor(parent, pageTitle) {
    this.#parent = parent;
    this.#pageTitle = pageTitle;
  }

  render() {
    this.renderTemplate();
  }

  getTop() {
    return this.#movies.slice(0, 3);
  }

  getCategoryMovies() {
    apiClient.get({
      path: 'movies',
      callback: (response) => {
        this.#movies = response;
        const moviesBlock = document.getElementById('category-page-content');
        const moviesList = new CardsList(moviesBlock, this.#movies, 3);
        moviesList.render();
      },
    });
  }

  renderTemplate() {
    const template = Handlebars.templates['CategoryPage.hbs'];
    this.#parent.innerHTML = template({
      title: this.#pageTitle,
    });
    this.getCategoryMovies();
  }
}

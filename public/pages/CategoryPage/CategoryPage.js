import { CardsList } from '../../components/CardsList/CardsList';
import { apiClient } from '../../modules/ApiClient';
import { MainPage } from '../MainPage/MainPage';
import template from './CategoryPage.hbs';

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

  /**
   * Send get movies from category request
   * @param {}
   * @returns {}
   */
  async getCategoryMovies() {
    const response = await apiClient.get({
      path: 'movies',
    });

    this.#movies = response;
    const moviesBlock = document.getElementById('category-page-content');
    const moviesList = new CardsList(moviesBlock, this.#movies, 3);
    moviesList.render();
  }

  /**
   * Navigate to previous page
   * @param {}
   * @returns {}
   */
  goBack() {
    const backButton = document.getElementById('category-page-button-back');
    const main = document.querySelector('main');

    backButton.addEventListener('click', () => {
      main.innerHTML = '';
      const mainPage = new MainPage(main);
      mainPage.render();
    });
  }

  renderTemplate() {
    this.#parent.innerHTML = template({
      title: this.#pageTitle,
    });
    this.getCategoryMovies();
    this.goBack();
  }
}

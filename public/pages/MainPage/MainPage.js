import { CardsList } from '../../components/CardsList/CardsList';
import { movies } from '../../consts';
import { apiClient } from '../../modules/ApiClient';

export class MainPage {
  #parent;
  #bestMovies;
  #newMovies;
  #isLoading;
  // #isLoadingBestMovies;
  // #isLoadingNewMovies;

  constructor(parent) {
    this.#parent = parent;
    this.#bestMovies = [];
    this.#newMovies = [];
    this.#isLoading = true;
    // this.#isLoadingBestMovies = true;
    // this.#isLoadingNewMovies = true;
  }

  showLoader() {
    const loader = document.getElementById('global-loader');
    const mainContent = document.getElementById('main-content');
    if (loader) loader.style.display = 'block';
    if (mainContent) mainContent.style.display = 'none';
  }

  hideLoader() {
    const loader = document.getElementById('global-loader');
    const mainContent = document.getElementById('main-content');
    if (loader) loader.style.display = 'none';
    if (mainContent) mainContent.style.display = 'block';
  }

  render() {
    this.renderTemplate();
  }

  getBestMovies() {
    this.#isLoading = true;
    this.showLoader();

    apiClient.get({
      path: 'movies',
      callback: (response) => {
        this.#bestMovies = response.map((movie, index) => {
          return { ...movie, position: index + 1 };
        });

        this.#isLoading = false;
        this.hideLoader();

        const bestMoviesBlock = document.getElementById('best-movies-block');
        const bestMoviesList = new CardsList(
          bestMoviesBlock,
          this.#bestMovies,
          1
        );
        bestMoviesList.render();
      },
    });
  }

  getNewMovies() {
    apiClient.get({
      path: 'movies',
      callback: (response) => {
        this.#newMovies = response;
        const newMoviesBlock = document.getElementById('new-movies-block');
        const newMoviesList = new CardsList(newMoviesBlock, this.#newMovies, 2);
        newMoviesList.render();
      },
    });
  }

  renderTemplate() {
    const template = Handlebars.templates['MainPage.hbs'];
    this.#parent.innerHTML = template();

    this.getBestMovies();
    this.getNewMovies();
  }
}

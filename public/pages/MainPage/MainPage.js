import { CardsList } from '../../components/CardsList/CardsList';
import { apiClient } from '../../modules/ApiClient';

export class MainPage {
  #parent;
  #bestMovies;
  #newMovies;

  constructor(parent) {
    this.#parent = parent;
    this.#bestMovies = [];
    this.#newMovies = [];
  }

  render() {
    this.renderTemplate();
  }

  getBestMovies() {
    apiClient.get({
      path: 'movies',
      callback: (response) => {
        this.#bestMovies = response.map((movie, index) => {
          return { ...movie, position: index + 1 };
        });

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

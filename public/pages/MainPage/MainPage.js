import { apiClient } from '../../modules/ApiClient';
import { CardsList } from '../../components/CardsList/CardsList';
import { Slider } from '../../components/Slider/Slider';
import { Loader } from '../../components/Loader/Loader';

export class MainPage {
  #parent;
  #bestMovies;
  #newMovies;
  #loader;

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
        this.#loader.kill();
        this.#bestMovies = response.map((movie, index) => {
          return { ...movie, position: index + 1 };
        });

        const bestMoviesBlock = document.getElementById('best-movies-block');
        const bestMoviesSlider = new Slider(
          bestMoviesBlock,
          this.#bestMovies,
          1
        );
        bestMoviesSlider.render();
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

    this.#loader = new Loader(this.#parent, template());
    this.#loader.render();
    this.getBestMovies();
    this.getNewMovies();
  }
}

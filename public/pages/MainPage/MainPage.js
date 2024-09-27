import { apiClient } from '../../modules/ApiClient';
import { CardsList } from '../../components/CardsList/CardsList';
import { GridBlock } from '../../components/GridBlock/GridBlock';
import { Slider } from '../../components/Slider/Slider';
import { Loader } from '../../components/Loader/Loader';
import template from './MainPage.hbs';

import bb from '../../assets/mockImages/bb2.jpg';
import mh from '../../assets/mockImages/mh.jpg';
import sopranos from '../../assets/mockImages/sopranos.png';

const trendMoviesMock = [
  {
    src: bb,
  },
  {
    src: mh,
  },
  {
    src: sopranos,
  },
];

export class MainPage {
  #parent;
  #bestMovies;
  #newMovies;
  #trendMovies;
  #loader;

  constructor(parent) {
    this.#parent = parent;
    this.#bestMovies = [];
    this.#newMovies = [];
    this.#trendMovies = [];
  }

  render() {
    this.renderTemplate();
  }

  async getTrendMovies() {
    const response = await apiClient.get({
      path: 'movies',
    });

    this.#trendMovies = response;
  }

  async getBestMovies() {
    const response = await apiClient.get({
      path: 'movies',
    });

    this.#bestMovies = response.map((movie, index) => {
      return { ...movie, position: index + 1 };
    });
  }

  async getNewMovies() {
    const response = await apiClient.get({
      path: 'movies',
    });

    this.#newMovies = response;
  }

  /**
   * Render movies blocks
   * @param {}
   * @returns {}
   */
  async renderBlocks() {
    await Promise.all([
      this.getTrendMovies(),
      this.getBestMovies(),
      this.getNewMovies(),
    ]);

    this.#loader.kill();

    const trendMoviesBlock = document.getElementById('trend-movies-block');
    const trendMoviesList = new GridBlock(
      trendMoviesBlock,
      trendMoviesMock,
      'Сейчас в тренде',
    );
    trendMoviesList.render();

    const bestMoviesBlock = document.getElementById('best-movies-block');
    const bestMoviesSlider = new Slider(bestMoviesBlock, this.#bestMovies, 1);
    bestMoviesSlider.render();

    const newMoviesBlock = document.getElementById('new-movies-block');
    const newMoviesList = new CardsList(newMoviesBlock, this.#newMovies, 2);
    newMoviesList.render();
  }

  renderTemplate() {
    const rootElem = document.getElementById('root');
    rootElem.classList.add('root-black');
    rootElem.classList.remove('root-image');

    this.#parent.innerHTML = template();

    this.#loader = new Loader(this.#parent, template());
    this.#loader.render();

    this.renderBlocks();
  }
}

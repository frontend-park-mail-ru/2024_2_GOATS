import { apiClient } from '../../modules/ApiClient';
import { GridBlock } from '../../components/GridBlock/GridBlock';
import { Slider } from '../../components/Slider/Slider';
import { Loader } from '../../components/Loader/Loader';
import template from './MainPage.hbs';

import bb from '../../assets/mockImages/bb2.jpg';
import mh from '../../assets/mockImages/mh.jpg';
import sopranos from '../../assets/mockImages/sopranos.png';

// const trendMoviesMock = [
//   {
//     src: bb,
//   },
//   {
//     src: mh,
//   },
//   {
//     src: sopranos,
//   },
// ];

export class MainPage {
  #parent;
  #movieSelections;
  #loader;

  constructor(parent) {
    this.#parent = parent;
    this.#movieSelections = [];
  }

  render() {
    this.renderTemplate();
  }

  async checkAuth() {
    try {
      await apiClient.get({
        path: 'auth/session',
      });
    } catch {
      throw new Error('hello');
    }
  }

  async getTrendMovies() {
    const response = await apiClient.get({
      path: 'movie_collections/',
    });

    this.#movieSelections = response;
    console.log(response);
  }

  /**
   * Render movies blocks
   * @param {}
   * @returns {}
   */
  async renderBlocks() {
    await this.getTrendMovies(), this.#loader.kill();

    // const trendMoviesBlock = document.getElementById('trend-movies-block');
    // const trendMoviesList = new GridBlock(
    //   trendMoviesBlock,
    //   trendMoviesMock,
    //   'Сейчас в тренде',
    // );
    // trendMoviesList.render();

    // const bestMoviesBlock = document.getElementById('best-movies-block');
    // const bestMoviesSlider = new Slider(bestMoviesBlock, this.#bestMovies, 1);
    // bestMoviesSlider.render();
  }

  renderTemplate() {
    const rootElem = document.getElementById('root');
    rootElem.classList.add('root-black');
    rootElem.classList.remove('root-image');

    this.#parent.innerHTML = template();

    this.#loader = new Loader(this.#parent, template());
    this.#loader.render();
    this.checkAuth();
    this.renderBlocks();
  }
}

import { apiClient } from '../../modules/ApiClient';
import { GridBlock } from '../../components/GridBlock/GridBlock';
import { Slider } from '../../components/Slider/Slider';
import { Loader } from '../../components/Loader/Loader';
import template from './MainPage.hbs';
import { serializeCollections } from '../../modules/Serializer';

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

  // async checkAuth() {
  //   try {
  //     await apiClient.get({
  //       path: 'auth/session',
  //     });
  //   } catch {
  //     throw new Error('hello');
  //   }
  // }

  async getTrendMovies() {
    const response = await apiClient.get({
      path: 'movie_collections/',
    });

    this.#movieSelections = serializeCollections(response.collections);
  }

  /**
   * Render movies blocks
   * @param {}
   * @returns {}
   */
  async renderBlocks() {
    await this.getTrendMovies();
    this.#loader.kill();

    const trendMoviesBlock = document.getElementById('trend-movies-block');
    const trendMoviesList = new GridBlock(
      trendMoviesBlock,
      this.#movieSelections[0].movies,
      this.#movieSelections[0].title,
    );
    trendMoviesList.render();

    const mainPageBlocks = document.querySelector('.main-page__blocks');
    this.#movieSelections.slice(1).forEach((selection) => {
      const newBlock = document.createElement('div');
      newBlock.classList.add('main-page__block');
      newBlock.id = `main-page-block-${selection.id}`;
      mainPageBlocks.appendChild(newBlock);

      const slider = new Slider(newBlock, selection);
      slider.render();
    });
  }

  renderTemplate() {
    const rootElem = document.getElementById('root');
    rootElem.classList.add('root-black');
    rootElem.classList.remove('root-image');

    this.#parent.innerHTML = template();

    this.#loader = new Loader(this.#parent, template());
    this.#loader.render();
    // this.checkAuth();
    this.renderBlocks();
  }
}

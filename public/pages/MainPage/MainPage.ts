import { apiClient } from '../../modules/ApiClient';
import { GridBlock } from '../../components/GridBlock/GridBlock';
import { Slider } from '../../components/Slider/Slider';
import { Loader } from '../../components/Loader/Loader';
import template from './MainPage.hbs';
import { serializeCollections } from '../../modules/Serializer';
// import { checkAuth } from '../..';
// import { checkAuth } from 'modules/RouterHandler';
import { Movie, MovieSelection } from 'types/movie';
import { VideoPlayer } from 'components/VideoPlayer/VideoPlayer';

export class MainPage {
  // #parent;
  #movieSelections: MovieSelection[] = [];
  #loader!: Loader;

  constructor() {
    // this.#parent = parent;
    this.#movieSelections = [];
  }

  render() {
    this.renderTemplate();
  }

  /**
   * send request for movies collection
   * @param {}
   * @returns {}
   */
  async getCollection() {
    const response = await apiClient.get({
      path: 'movie_collections/',
    });

    this.#movieSelections = serializeCollections(response.collections).sort(
      (selection1: any, selection2: any) => selection1.id - selection2.id,
    );
  }

  /**
   * Render movies blocks
   * @param {}
   * @returns {}
   */
  async renderBlocks() {
    // await Promise.allSettled([checkAuth(), this.getCollection()]);
    await Promise.allSettled([this.getCollection()]);
    this.#loader.kill();

    const trendMoviesBlock = document.getElementById('trend-movies-block');
    if (trendMoviesBlock) {
      const trendMoviesList = new GridBlock(
        trendMoviesBlock,
        this.#movieSelections[0].movies,
        this.#movieSelections[0].title,
      );
      trendMoviesList.render();
    }

    const mainPageBlocks = document.querySelector('.main-page__blocks');
    this.#movieSelections.slice(1).forEach((selection) => {
      const newBlock = document.createElement('div');
      newBlock.classList.add('main-page__block');
      newBlock.id = `main-page-block-${selection.id}`;
      if (mainPageBlocks) {
        mainPageBlocks.appendChild(newBlock);
      }

      const slider = new Slider(newBlock, selection);
      slider.render();
    });

    // const videoContainer = document.getElementById('test-video');
    // if (videoContainer) {
    //   const video = new VideoPlayer(
    //     videoContainer,
    //     'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    //   );

    //   video.render();
    // }
  }

  renderTemplate() {
    const rootElem = document.getElementById('root');
    if (rootElem) {
      rootElem.classList.add('root-black');
      rootElem.classList.remove('root-image');
    }
    const pageElement = document.getElementsByTagName('main')[0];
    pageElement.innerHTML = template();

    // this.#parent.innerHTML = template();

    this.#loader = new Loader(pageElement, template());
    this.#loader.render();

    this.renderBlocks();
  }
}

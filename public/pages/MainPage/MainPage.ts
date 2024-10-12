import { GridBlock } from '../../components/GridBlock/GridBlock';
import { Slider } from '../../components/Slider/Slider';
import { Loader } from '../../components/Loader/Loader';
import template from './MainPage.hbs';
import { MovieSelection } from 'types/movie';
import { VideoPlayer } from 'components/VideoPlayer/VideoPlayer';
import { mainPageStore } from './MainPageStore';
import { EventEmitter } from 'events';

export class MainPage {
  #movieSelections: MovieSelection[] = [];
  #loader!: Loader;

  constructor() {
    this.#movieSelections = [];
  }

  render() {
    this.#movieSelections = mainPageStore.getSelections();
    this.renderTemplate();
  }

  /**
   * Render movies blocks
   * @param {}
   * @returns {}
   */
  async renderBlocks() {
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

    const videoContainer = document.getElementById('test-video');
    if (videoContainer) {
      const video = new VideoPlayer(
        videoContainer,
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      );

      video.render();
    }
  }

  renderTemplate() {
    const rootElem = document.getElementById('root');
    if (rootElem) {
      rootElem.classList.add('root-black');
      rootElem.classList.remove('root-image');
    }
    const pageElement = document.getElementsByTagName('main')[0];
    this.#loader = new Loader(pageElement, template());
    if (this.#movieSelections.length) {
      pageElement.innerHTML = template();
    } else {
      // console.log('LOADER');
      this.#loader.render();
    }

    this.renderBlocks();
  }
}

import { GridBlock } from '../../components/GridBlock/GridBlock';
import { Slider } from '../../components/Slider/Slider';
import template from './MainPage.hbs';
import { MovieSelection } from 'types/movie';
import { mainPageStore } from 'store/MainPageStore';
import { router } from 'modules/Router';

export class MainPage {
  #movieSelections: MovieSelection[] = [];

  constructor() {
    this.#movieSelections = [];
  }

  render() {
    this.#movieSelections = mainPageStore.getSelections();
    this.renderTemplate();
  }

  renderBlocks() {
    const isLoaded = !!this.#movieSelections.length;
    const trendMoviesBlock = document.getElementById(
      'trend-movies-block',
    ) as HTMLElement;
    if (this.#movieSelections.length) {
      const trendMoviesList = new GridBlock({
        parent: trendMoviesBlock,
        movies: this.#movieSelections[0].movies,
        blockTitle: this.#movieSelections[0].title,
        onImageClick: (id: number) => router.go('/movie', id),
      });
      trendMoviesList.render();
    } else {
      const trendMoviesList = new GridBlock({
        parent: trendMoviesBlock,
        movies: null,
        blockTitle: '',
        onImageClick: () => {},
      });
      trendMoviesList.render();
    }

    const mainPageBlocks = document.querySelector(
      '.main-page__blocks',
    ) as HTMLElement;

    const newBlock = document.createElement('div');
    if (!isLoaded) {
      const slider = new Slider({
        parent: newBlock,
        id: 1,
        type: 'movies',
      });
      slider.render();
      slider.render();
    } else {
      this.#movieSelections.slice(1).forEach((selection) => {
        const newBlock = document.createElement('div');
        newBlock.classList.add('main-page__block');
        newBlock.id = `main-page-block-${selection.id}`;
        if (mainPageBlocks) {
          mainPageBlocks.appendChild(newBlock);
        }

        const slider = new Slider({
          parent: newBlock,
          id: selection.id,
          type: 'movies',
          selection: selection,
        });

        slider.render();
      });
    }
  }

  renderTemplate() {
    const rootElem = document.getElementById('root');
    if (rootElem) {
      rootElem.classList.add('root-black');
      rootElem.classList.remove('root-image');
    }
    const pageElement = document.getElementsByTagName('main')[0];
    pageElement.innerHTML = template();

    this.renderBlocks();
  }
}

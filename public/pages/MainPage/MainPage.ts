import { GridBlock } from '../../components/GridBlock/GridBlock';
import { Slider } from '../../components/Slider/Slider';
import template from './MainPage.hbs';
import { MovieSelection } from 'types/movie';
import { mainPageStore } from 'store/MainPageStore';
import { moviePageStore } from 'store/MoviePageStore';
import { router } from 'modules/Router';
import { Actions } from 'flux/Actions';
import { isMobileDevice } from 'modules/IsMobileDevice';

export class MainPage {
  #movieSelections: MovieSelection[] = [];

  constructor() {
    this.#movieSelections = [];
  }

  render() {
    this.#movieSelections = mainPageStore.getSelections();
    Actions.getLastMovies();
    this.renderTemplate();
  }

  renderBlocks() {
    const isLoaded = !!this.#movieSelections.length;
    const mainPageBlocks = document.querySelector(
      '.main-page__blocks',
    ) as HTMLElement;

    if (isLoaded && moviePageStore.getLastMovies().length) {
      const newBlock = document.createElement('div');
      newBlock.classList.add('main-page__block');
      newBlock.id = `main-page-block-0`;
      const firstChild = mainPageBlocks.firstChild;
      mainPageBlocks.insertBefore(newBlock, firstChild);

      const slider = new Slider({
        parent: newBlock,
        id: 1,
        type: 'progress',
        savedMovies: moviePageStore.getLastMovies(),
      });

      slider.render();
    }

    const trendMoviesBlock = document.getElementById(
      'trend-movies-block',
    ) as HTMLElement;
    if (!isMobileDevice()) {
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
    } else {
      const slider = new Slider({
        parent: trendMoviesBlock,
        id: 0,
        type: 'movies',
        selection: this.#movieSelections[0],
      });

      slider.render();
    }

    const newBlock = document.createElement('div');
    if (!isLoaded) {
      const slider = new Slider({
        parent: newBlock,
        id: 1,
        type: 'selection',
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
          type: 'selection',
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

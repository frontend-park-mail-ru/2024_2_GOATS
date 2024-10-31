import { GridBlock } from '../../components/GridBlock/GridBlock';
import { Slider } from '../../components/Slider/Slider';
import { Loader } from '../../components/Loader/Loader';
import template from './MainPage.hbs';
import { MovieSelection } from 'types/movie';
import { mainPageStore } from 'store/MainPageStore';
import { router } from 'modules/Router';

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

  // showExpandedCard = () => {
  //   const cards = document.querySelectorAll('.card');
  //   cards.forEach((card) => {
  //     card.addEventListener('mouseover', (e: any) => {
  //       console.log(`Карточка с ID ${card.id}:`);
  //       console.log(`X координата: ${e.clientX}`);
  //       console.log(`Y координата: ${e.clientY}`);
  //     });

  //     card.addEventListener('mouseout', () => {
  //       console.log('Мышь покинула карточку');
  //     });
  //   });
  // };

  async renderBlocks() {
    const trendMoviesBlock = document.getElementById('trend-movies-block');
    console.log('aaaaaaaaaaaaaa', this.#movieSelections);
    if (trendMoviesBlock) {
      const trendMoviesList = new GridBlock(
        trendMoviesBlock,
        this.#movieSelections[0].movies,
        this.#movieSelections[0].title,
        (id: number) => router.go('/movie', id),
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
      this.#loader.render();
    }

    this.renderBlocks();
    // this.showExpandedCard();
  }
}

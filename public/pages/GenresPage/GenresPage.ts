import { MovieSelection } from 'types/movie';
import template from './GenresPage.hbs';
import { genresPageStore } from 'store/GenresPageStore';
import { Slider } from 'components/Slider/Slider';

export class GenresPage {
  #movieGenres: MovieSelection[] = [];

  render() {
    this.#movieGenres = genresPageStore.getGenres();
    this.renderTemplate();
  }

  renderSliders() {
    const isLoaded = !!this.#movieGenres.length;

    const genresContainer = document.querySelector(
      '.genres-page__blocks',
    ) as HTMLDivElement;

    const newBlock = document.createElement('div');
    if (!isLoaded) {
      const slider = new Slider({
        parent: newBlock,
        id: 1,
        type: 'selection',
      });
      slider.render();
      slider.render();
      slider.render();
    } else {
      this.#movieGenres.forEach((movieGenre) => {
        const newBlock = document.createElement('div');
        newBlock.classList.add('main-page__block');
        newBlock.id = `genres-page-block-${movieGenre.id}`;
        if (genresContainer) {
          genresContainer.appendChild(newBlock);
        }

        const slider = new Slider({
          parent: newBlock,
          id: movieGenre.id,
          type: 'selection',
          selection: movieGenre,
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
    this.renderSliders();
  }
}

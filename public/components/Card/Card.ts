import { CardPreview } from 'components/CardPreview/CardPreview';
import template from './Card.hbs';
import { Movie } from 'types/movie';

export class Card {
  #parent;
  #movie;
  #onCardClick;

  constructor(parent: HTMLElement, movie: Movie, onCardClick: () => void) {
    this.#parent = parent;
    this.#movie = movie;
    this.#onCardClick = onCardClick;
  }

  // showExpandedCard = () => {
  //   const card = document.getElementById(
  //     `movie-card-${this.#movie.id}`,
  //   ) as HTMLElement;
  //   const previewBlock = document.getElementById('preview') as HTMLElement;

  //   card.addEventListener('mouseover', () => {
  //     const a = card.getBoundingClientRect();
  //     console.log(a);
  //     previewBlock.classList.add('visible');

  //     preview.render();
  //     console.log(`Навели на карточку с фильмом  ${this.#movie.id}:`);
  //   });

  //   card.addEventListener('mouseout', () => {
  //     previewBlock.classList.remove('visible');
  //     previewBlock.innerHTML = '';
  //     console.log('Мышь покинула карточку');
  //   });
  // };

  showExpandedCard = () => {
    const card = document.getElementById(
      `movie-card-${this.#movie.id}`,
    ) as HTMLElement;
    const previewBlock = document.getElementById('preview') as HTMLElement;

    let timeoutId: any;

    card.addEventListener('mouseover', () => {
      console.log(`Навели на карточку с фильмом ${this.#movie.id}:`);

      timeoutId = setTimeout(() => {
        // console.log('aaaaaaaa');
        const a = card.getBoundingClientRect();
        previewBlock.classList.add('visible');
        const preview = new CardPreview(this.#movie, previewBlock, a);
        preview.render();
      }, 1000);
    });

    card.addEventListener('mouseout', () => {
      console.log('Мышь покинула карточку');
      previewBlock.classList.remove('visible');
      previewBlock.innerHTML = '';

      if (timeoutId) clearTimeout(timeoutId);
    });

    card.addEventListener('click', () => {
      console.log('Мышь покинула карточку');
      previewBlock.classList.remove('visible');
      previewBlock.innerHTML = '';

      if (timeoutId) clearTimeout(timeoutId);
    });
  };

  render() {
    this.renderTemplate();
  }

  handleCardClick() {
    const card = document.getElementById(
      `movie-card-${this.#movie.id}`,
    ) as HTMLElement;
    card.addEventListener('click', this.#onCardClick);
  }

  renderTemplate() {
    this.#parent.insertAdjacentHTML(
      'beforeend',
      template({ movie: this.#movie }),
    );

    this.handleCardClick();
    this.showExpandedCard();
  }
}

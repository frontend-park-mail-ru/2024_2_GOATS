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

  showExpandedCard = () => {
    const card = document.getElementById(
      `movie-card-${this.#movie.id}`,
    ) as HTMLElement;
    const previewBlock = document.getElementById('preview') as HTMLElement;
    let timeoutId: any;

    card.addEventListener('mouseover', () => {
      timeoutId = setTimeout(() => {
        const a = card.getBoundingClientRect();
        previewBlock.classList.add('visible');
        const preview = new CardPreview(this.#movie, previewBlock, a);
        preview.render();
      }, 800);
    });

    card.addEventListener('mouseout', () => {
      const cardPreview = document.getElementById(
        'card-preview',
      ) as HTMLElement;
      if (previewBlock.classList.contains('visible')) {
        cardPreview.classList.add('shrink');
      }

      setTimeout(() => {
        previewBlock.classList.remove('visible');
        previewBlock.innerHTML = '';
      }, 300);

      if (timeoutId) clearTimeout(timeoutId);
    });

    card.addEventListener('click', () => {
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

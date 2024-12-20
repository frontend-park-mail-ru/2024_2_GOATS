import { CardPreview } from 'components/CardPreview/CardPreview';
import template from './Card.hbs';
import skeletonTemplate from './CardSkeleton.hbs';
import { Movie } from 'types/movie';
import {
  CARD_PREVIEW_EXPANDING_TIMEOUT,
  CARD_PREVIEW_HIDING_TIMEOUT,
} from '../../consts';
import { isMobileDevice } from 'modules/IsMobileDevice';

export class Card {
  #parent;
  #movie;
  #onCardClick;
  #cardId;
  #imageBlobUrl: string | null = null;

  constructor(
    parent: HTMLElement,
    movie: Movie | null,
    onCardClick: () => void,
    cardId?: string,
  ) {
    this.#parent = parent;
    this.#movie = movie;
    this.#onCardClick = onCardClick;
    this.#cardId = cardId;
  }

  showExpandedCard = () => {
    const card = document.getElementById(
      `movie-card-${this.#cardId ? this.#cardId : this.#movie && this.#movie.id}`,
    ) as HTMLElement;
    const previewBlock = document.getElementById('preview') as HTMLElement;
    let timeoutId: any;

    if (card && !isMobileDevice()) {
      card.addEventListener('mouseover', () => {
        timeoutId = setTimeout(() => {
          const coor = card.getBoundingClientRect();
          previewBlock.classList.add('visible');
          if (this.#movie) {
            const preview = new CardPreview(this.#movie, previewBlock, coor);
            preview.render();
          }
        }, CARD_PREVIEW_EXPANDING_TIMEOUT);
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
        }, CARD_PREVIEW_HIDING_TIMEOUT);

        if (timeoutId) clearTimeout(timeoutId);
      });

      card.addEventListener('click', () => {
        previewBlock.classList.remove('visible');
        previewBlock.innerHTML = '';

        if (timeoutId) clearTimeout(timeoutId);
      });
    }
  };

  render() {
    this.renderTemplate();
  }

  handleCardClick() {
    const card = document.getElementById(
      `movie-card-${this.#cardId ? this.#cardId : this.#movie && this.#movie.id}`,
    ) as HTMLElement;
    card.addEventListener('click', this.#onCardClick);
  }

  renderTemplate() {
    if (!this.#movie) {
      this.#parent.insertAdjacentHTML('beforeend', skeletonTemplate());
    } else {
      this.#parent.insertAdjacentHTML(
        'beforeend',
        template({
          movie: this.#movie,
          id: `${this.#cardId ? this.#cardId : this.#movie && this.#movie.id}`,
        }),
      );

      this.handleCardClick();
      this.showExpandedCard();
    }
  }
}

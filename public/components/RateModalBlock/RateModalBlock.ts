import { MovieDetailed } from 'types/movie';
import template from './RateModalBlock.hbs';
import { moviePageStore } from 'store/MoviePageStore';

export class RateModalBlock {
  #movie!: MovieDetailed | null;
  render() {
    this.#movie = moviePageStore.getMovie();
    this.renderTemplate();
  }

  handleModalRateClose() {
    const rateOverlay = document.querySelector(
      '.rate-modal-block__overlay',
    ) as HTMLElement;
    const rateSheet = document.getElementById(
      'rate-modal-block',
    ) as HTMLElement;

    rateOverlay.addEventListener('click', () => {
      rateSheet.classList.remove('show');
      setTimeout(() => {
        rateSheet.remove();
      }, 200);
    });
  }

  displayInitialRating() {
    const slider = document.querySelector('.stars-slider') as HTMLElement;
    const items = document.querySelectorAll(
      '.stars-slider__item',
    ) as NodeListOf<HTMLElement>;

    const itemWidth = items[0].offsetWidth;
    if (this.#movie?.userRating) {
      slider.scrollLeft = itemWidth * this.#movie?.userRating - itemWidth;
      items[this.#movie?.userRating].classList.add('selected');
    }
  }

  handleRatingScrolling() {
    const slider = document.querySelector('.stars-slider') as HTMLElement;
    const items = document.querySelectorAll(
      '.stars-slider__item',
    ) as NodeListOf<HTMLElement>;
    if (this.#movie?.userRating === 0) {
      items[1].classList.add('selected');
    }

    slider.addEventListener('scroll', () => {
      const scrollPosition = slider.scrollLeft;
      const itemWidth = items[0].offsetWidth;
      const sliderWidth = slider.offsetWidth;
      const centerIndex = Math.round(
        (scrollPosition + sliderWidth / 2 - itemWidth) / itemWidth,
      );
      const selectedItem = items[centerIndex - 2];

      // Удаляем класс 'selected' у всех элементов
      items.forEach((item) => item.classList.remove('selected'));

      // Добавляем класс 'selected' текущему элементу
      if (selectedItem) {
        selectedItem.classList.add('selected');
      }
    });
  }

  renderTemplate() {
    const root = document.getElementById('root');
    if (root) {
      root.insertAdjacentHTML(
        'beforeend',
        template({
          isUserVoted: this.#movie?.userRating,
        }),
      );
      root.style.overflow = 'hidden';
    }
    const modal = document.getElementById('rate-modal-block') as HTMLElement;
    setTimeout(() => {
      modal.classList.add('show');
    });
    this.handleModalRateClose();
    this.handleRatingScrolling();
    this.displayInitialRating();
  }
}

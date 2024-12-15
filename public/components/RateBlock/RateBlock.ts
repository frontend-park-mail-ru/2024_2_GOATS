import { userStore } from 'store/UserStore';
import template from './RateBlock.hbs';
import { router } from 'modules/Router';
import { moviePageStore } from 'store/MoviePageStore';
import { MovieDetailed } from 'types/movie';
import { Actions } from 'flux/Actions';

export class RateBlock {
  #movie!: MovieDetailed | null;
  //   #rating: number | undefined;
  //   #userRating: number;
  #parent: HTMLElement;

  constructor(
    // rating: number | undefined,
    // userRating: number,
    parent: HTMLElement,
  ) {
    // this.#rating = rating;
    // this.#userRating = userRating;
    this.#parent = parent;
  }

  render() {
    this.#movie = moviePageStore.getMovie();
    this.renderTemplate();
  }

  handleAuthClick() {
    if (!userStore.getUser().email) {
      const authButton = document.getElementById(
        'rate-block-auth-button',
      ) as HTMLElement;
      authButton.addEventListener('click', () => {
        router.go('/auth');
      });
    }
  }

  handleStarsHover() {
    const stars = document.querySelectorAll(
      '.rating-star',
    ) as NodeListOf<HTMLElement>;

    stars.forEach((star, index) => {
      star.addEventListener('click', () => {
        Actions.rateMovie(index + 1);
        this.render();
      });
      if (this.#movie?.userRating === 0) {
        star.addEventListener('mouseenter', () => {
          this.highlightStars(index);
        });
        star.addEventListener('mouseleave', () => {
          this.resetStars();
        });
      }
    });
  }

  highlightStars(index: number) {
    const stars = document.querySelectorAll(
      '.rating-star',
    ) as NodeListOf<HTMLElement>;

    stars.forEach((star, i) => {
      if (i <= index) {
        star.classList.add('active-star');
      } else {
        star.classList.remove('active-star');
      }
    });
  }

  resetStars() {
    const stars = document.querySelectorAll(
      '.rating-star',
    ) as NodeListOf<HTMLElement>;

    stars.forEach((star) => {
      star.classList.remove('active-star');
    });

    if (this.#movie?.userRating !== 0 && this.#movie?.userRating) {
      for (let i = 0; i < this.#movie?.userRating; i++) {
        stars[i].classList.add('active-star');
      }
    }
  }

  coloringInitialRatingStars() {
    if (!!userStore.getUser().email) {
      const stars = document.querySelectorAll(
        '.rating-star',
      ) as NodeListOf<HTMLElement>;

      if (stars && this.#movie?.userRating) {
        for (let i = 0; i < this.#movie.userRating; i++) {
          stars[i].classList.add('active-star');
        }
      }
    }
  }

  // не удалять
  // deleteRating() {
  //   const deleteRatingButton = document.getElementById(
  //     'rate-block-delete-rate-button',
  //   ) as HTMLElement;

  //   if (deleteRatingButton) {
  //     deleteRatingButton.addEventListener('click', () => {
  //       Actions.deleteRating();
  //       this.render();
  //     });
  //   }
  // }

  renderTemplate() {
    this.#parent.innerHTML = template({
      isUserAuth: !!userStore.getUser().email,
      rating: this.#movie?.rating.toFixed(1),
      userRating: this.#movie?.userRating,
      isUserVoted: this.#movie?.userRating !== 0,
    });

    this.handleAuthClick();
    this.coloringInitialRatingStars();
    this.handleStarsHover();
    // this.deleteRating(); // не удалять
  }
}

import template from './MovieDescription.hbs';
import skeletonTemplate from './MovieDescriptionSkeleton.hbs';
import { moviePageStore } from 'store/MoviePageStore';
import { roomPageStore } from 'store/RoomPageStore';
import { userStore } from 'store/UserStore';
import { MovieDetailed } from 'types/movie';
import { router } from 'modules/Router';
import { Actions } from 'flux/Actions';
import { RateModalBlock } from 'components/RateModalBlock/RateModalBlock';

export class MovieDescription {
  #parent;
  #movie!: MovieDetailed | null;
  #createdRoomId = '';
  #onWatchClick;

  #isMobileRateOpen: boolean;

  constructor(parent: HTMLElement, onWatchClick: () => void) {
    this.#parent = parent;
    this.#onWatchClick = onWatchClick;
    this.#isMobileRateOpen = false;

    const unsubscribeRoomId = roomPageStore.isCreatedRoomReceived$.addListener(
      () => {
        if (roomPageStore.getCreatedRoomId()) {
          this.#createdRoomId = roomPageStore.getCreatedRoomId();
          roomPageStore.setIsModalConfirm(true);
          router.go('/room', roomPageStore.getCreatedRoomId());
        }
      },
    );

    this.ngOnRoomIdDestroy = () => {
      unsubscribeRoomId();
    };
  }

  ngOnRoomIdDestroy(): void {}

  render() {
    this.#movie = moviePageStore.getMovie();
    this.renderTemplate();
  }

  handleModalRateOpen() {
    const rateButton = document.getElementById(
      'mobile-rate-movie-btn',
    ) as HTMLElement;
    if (rateButton) {
      rateButton.addEventListener('click', () => {
        const m = new RateModalBlock();
        m.render();
      });
    }
  }

  handleShowMovie() {
    const showBtn = document.getElementById(
      'show-movie-btn',
    ) as HTMLButtonElement;

    showBtn.addEventListener('click', () => {
      this.#onWatchClick();
    });
  }

  // TODO: Совместный просмор в разработке
  // handleWatchTogether() {
  //   const watchTogetherBtn = document.getElementById(
  //     'watch-together-btn',
  //   ) as HTMLButtonElement;

  //   watchTogetherBtn.addEventListener('click', async () => {
  //     if (this.#movie) {
  //       Actions.createRoom(1); // TODO: поменять на movie.id после тестирования
  //     }
  //   });
  // }

  onFavoritesClick() {
    if (this.#movie) {
      if (this.#movie.isFromFavorites) {
        Actions.deleteFromFavorites(this.#movie.id);
      } else {
        Actions.addToFavorites(this.#movie.id);
      }
    }
  }

  handleFavoritesClick() {
    const favoritesBtn = document.getElementById(
      'favorites-movie-btn',
    ) as HTMLButtonElement;

    if (favoritesBtn) {
      favoritesBtn.addEventListener('click', this.onFavoritesClick.bind(this));
    }
  }

  checkFavorite() {
    if (this.#movie?.isFromFavorites) {
      const favoritesBtn = document.getElementById(
        'favorites-movie-btn',
      ) as HTMLButtonElement;

      if (favoritesBtn) {
        favoritesBtn.style.backgroundImage =
          'url("/assets/icons/favoritesIconAdded.svg")';
      }
    }
  }

  renderTemplate() {
    if (this.#movie) {
      this.#parent.innerHTML = template({
        movie: this.#movie,
        isUserAuth: !!userStore.getUser().email,
      });

      this.checkFavorite();
      this.handleShowMovie();
      this.handleFavoritesClick();
      this.handleModalRateOpen();
    } else {
      this.#parent.innerHTML = skeletonTemplate();
    }
  }
}

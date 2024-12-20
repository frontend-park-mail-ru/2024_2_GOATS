import template from './MovieDescription.hbs';
import skeletonTemplate from './MovieDescriptionSkeleton.hbs';
import { moviePageStore } from 'store/MoviePageStore';
import { roomPageStore } from 'store/RoomPageStore';
import { userStore } from 'store/UserStore';
import { MovieDetailed } from 'types/movie';
import { router } from 'modules/Router';
import { Actions } from 'flux/Actions';
import { RateModalBlock } from 'components/RateModalBlock/RateModalBlock';
import { Notifier } from 'components/Notifier/Notifier';
import { debounce } from 'modules/Debounce';

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

          const notifier = new Notifier(
            'success',
            'Комната успешно создана',
            3000,
          );

          notifier.render();
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

    if (showBtn) {
      showBtn.addEventListener('click', () => {
        this.#onWatchClick();
      });
    }
  }

  handleWatchTogether() {
    const watchTogetherBtn = document.getElementById(
      'watch-together-btn',
    ) as HTMLButtonElement;

    if (userStore.getUser().username && watchTogetherBtn) {
      watchTogetherBtn.addEventListener('click', async () => {
        if (this.#movie) {
          Actions.createRoom(this.#movie.id);
        }
      });
    }
  }

  onFavoritesClick() {
    if (this.#movie) {
      if (this.#movie.isFromFavorites) {
        Actions.deleteFromFavorites(this.#movie.id);
      } else {
        Actions.addToFavorites(this.#movie.id);
      }
    }
  }

  // handleFavoritesClick() {
  //   const favoritesBtn = document.getElementById(
  //     'favorites-movie-btn',
  //   ) as HTMLButtonElement;
  //   const debouncedUpdateValue = debounce(() => {
  //     this.onFavoritesClick.bind(this);
  //   }, 1000);
  //   if (favoritesBtn) {
  //     favoritesBtn.addEventListener('click', () => debouncedUpdateValue());
  //   }
  // }

  handleFavoritesClick() {
    const favoritesBtn = document.getElementById(
      'favorites-movie-btn',
    ) as HTMLButtonElement;
    const debouncedUpdateValue = debounce(
      this.onFavoritesClick.bind(this),
      200,
    );
    if (favoritesBtn) {
      favoritesBtn.addEventListener('click', () => debouncedUpdateValue());
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
      const date = this.#movie.releaseDate.split(' ')[2];
      const genres = this.#movie.genres?.join(', ');

      this.#parent.innerHTML = template({
        movie: this.#movie,
        releaseYear: date,
        isUserAuth: !!userStore.getUser().email,
        isPremiumUser: userStore.getUser().isPremium,
        withSubscription: moviePageStore.getMovie()?.withSubscription,
        movieRating: moviePageStore.getMovie()?.rating.toFixed(1),
        genres,
      });

      this.checkFavorite();
      this.handleShowMovie();
      this.handleFavoritesClick();
      this.handleWatchTogether();
      this.handleModalRateOpen();
    } else {
      this.#parent.innerHTML = skeletonTemplate();
    }
  }
}

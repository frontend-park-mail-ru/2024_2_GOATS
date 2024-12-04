import template from './MovieDescription.hbs';
import skeletonTemplate from './MovieDescriptionSkeleton.hbs';
import { moviePageStore } from 'store/MoviePageStore';
import { roomPageStore } from 'store/RoomPageStore';
import { userStore } from 'store/UserStore';
import { MovieDetailed } from 'types/movie';
import { router } from 'modules/Router';
import { Actions } from 'flux/Actions';

export class MovieDescription {
  #parent;
  #movie!: MovieDetailed | null;
  #createdRoomId = '';
  #onWatchClick;

  constructor(parent: HTMLElement, onWatchClick: () => void) {
    this.#parent = parent;
    this.#onWatchClick = onWatchClick;

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

  handleShowMovie() {
    const showBtn = document.getElementById(
      'show-movie-btn',
    ) as HTMLButtonElement;

    showBtn.addEventListener('click', () => {
      this.#onWatchClick();
    });
  }

  // TODO: Совместный просмор в разработке
  handleWatchTogether() {
    const watchTogetherBtn = document.getElementById(
      'watch-together-btn',
    ) as HTMLButtonElement;

    watchTogetherBtn.addEventListener('click', async () => {
      if (this.#movie) {
        Actions.createRoom(this.#movie.id);
      }
    });
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
      this.handleWatchTogether();
    } else {
      this.#parent.innerHTML = skeletonTemplate();
    }
  }
}

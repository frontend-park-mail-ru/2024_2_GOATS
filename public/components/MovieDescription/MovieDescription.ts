import template from './MovieDescription.hbs';
import skeletonTemplate from './MovieDescriptionSkeleton.hbs';
import { moviePageStore } from 'store/MoviePageStore';
import { roomPageStore } from 'store/RoomPageStore';
import { userStore } from 'store/UserStore';
import { MovieDetailed, MovieSaved, MovieSelection } from 'types/movie';
import { router } from 'modules/Router';
import { VideoPlayer } from 'components/VideoPlayer/VideoPlayer';
import { Actions } from 'flux/Actions';

export class MovieDescription {
  #parent;
  #movie!: MovieDetailed | null;
  #movieSelections: MovieSelection[] = [];
  #onFavoritesClick;
  #onVideoBackClick;
  #currentMovieSelection!: MovieSelection;
  #isModalOpened;
  #createdRoomId = '';
  #startTimeCode = 0;
  #fromRecentlyWatched;

  constructor(
    parent: HTMLElement,
    fromRecentlyWatched: boolean,
    onFavoritesClick: () => void,
    onVideoBackClick: (id: number) => void,
  ) {
    this.#parent = parent;
    this.#fromRecentlyWatched = fromRecentlyWatched;
    this.#onFavoritesClick = onFavoritesClick;
    this.#onVideoBackClick = onVideoBackClick;
    this.#isModalOpened = false;

    const unsubscribeMovie =
      moviePageStore.isNewSeriesReceivedEmitter$.addListener(() => {
        if (this.#isModalOpened) {
          this.#movie = moviePageStore.getMovie();
          this.renderVideoPlayer();
        }
      });

    const unsubscribeRoomId = roomPageStore.isCreatedRoomReceived$.addListener(
      () => {
        if (roomPageStore.getCreatedRoomId()) {
          this.#createdRoomId = roomPageStore.getCreatedRoomId();
          roomPageStore.setIsModalConfirm(true);
          router.go('/room', roomPageStore.getCreatedRoomId());
        }
      },
    );

    const unsubscribeLastMovies =
      moviePageStore.hasTimeCodeChangedEmitter$.addListener((status) => {
        if (status) {
          this.setStartTimecode();
        }
      });

    this.ngOnMovieDestroy = () => {
      unsubscribeMovie();
    };

    this.ngOnRoomIdDestroy = () => {
      unsubscribeRoomId();
    };

    this.ngOnLastMoviesDestroy = () => {
      unsubscribeLastMovies();
    };
  }

  ngOnMovieDestroy(): void {}
  ngOnRoomIdDestroy(): void {}
  ngOnLastMoviesDestroy(): void {}

  render() {
    this.#movie = moviePageStore.getMovie();
    this.#movieSelections = moviePageStore.getSelections();
    this.renderTemplate();
  }

  setCurrentMovieSelection() {
    this.#movieSelections.forEach((selection) => {
      if (selection.movies.some((movie) => movie.id === this.#movie?.id)) {
        this.#currentMovieSelection = selection;
      }
    });
  }

  getCurrentSeriesId() {
    return this.#currentMovieSelection.movies.findIndex(
      (movie) => movie.id === this.#movie?.id,
    );
  }

  onBackClick() {
    this.#isModalOpened = false;
    const videoContainer = document.getElementById(
      'video-container',
    ) as HTMLElement;

    videoContainer.innerHTML = '';
    videoContainer.style.zIndex = '-1';

    if (this.#movie) {
      this.#onVideoBackClick(this.#movie.id);
      Actions.getLastMovies();
      this.setStartTimecode();
    }
  }

  onNextSeriesClick() {
    Actions.changeSeries(
      this.#currentMovieSelection.movies[this.getCurrentSeriesId() + 1].id,
    );
  }

  onPrevSeriesClick() {
    Actions.changeSeries(
      this.#currentMovieSelection.movies[this.getCurrentSeriesId() - 1].id,
    );
  }

  handleSaveTimecode(timeCode: number, duration: number) {
    if (timeCode > duration * 0.95 || timeCode < duration * 0.05) {
      Actions.deleteLastMovie();
      return;
    }

    Actions.setLastMovies(timeCode, duration);
  }

  renderVideoPlayer() {
    this.#isModalOpened = true;
    const videoContainer = document.getElementById(
      'video-container',
    ) as HTMLElement;

    if (this.#movie) {
      const video = new VideoPlayer({
        parent: videoContainer,
        url: this.#movie.video,
        hasNextSeries:
          this.#currentMovieSelection.movies[
            this.#currentMovieSelection.movies.length - 1
          ].id > this.#movie.id,
        hasPrevSeries:
          this.#currentMovieSelection.movies[0].id < this.#movie.id,
        startTimeCode: this.#startTimeCode,
        onBackClick: this.onBackClick.bind(this),
        onNextButtonClick: this.onNextSeriesClick.bind(this),
        onPrevButtonClick: this.onPrevSeriesClick.bind(this),
        handleSaveTimecode: this.handleSaveTimecode.bind(this),
      });
      video.render();
      videoContainer.style.zIndex = '10';
    }
  }

  handleShowMovie() {
    const showBtn = document.getElementById(
      'show-movie-btn',
    ) as HTMLButtonElement;

    showBtn.addEventListener('click', () => {
      this.renderVideoPlayer();
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

  // TODO: Избранные к 3 РК
  // handleFavoritesClick() {
  //   const favoritesBtn = document.getElementById(
  //     'favorites-movie-btn',
  //   ) as HTMLButtonElement;
  //   favoritesBtn.addEventListener('click', this.#onFavoritesClick);
  // }

  setStartTimecode() {
    const foundSavedMovie = moviePageStore
      .getLastMovies()
      .find((movie: MovieSaved) => {
        return movie.id === this.#movie?.id;
      });

    if (foundSavedMovie) {
      this.#startTimeCode = foundSavedMovie.timeCode;
    } else {
      this.#startTimeCode = 0;
    }
  }

  renderTemplate() {
    this.setStartTimecode();

    if (this.#movie) {
      this.setCurrentMovieSelection();
      this.#parent.innerHTML = template({
        movie: this.#movie,
        isUserAuth: !!userStore.getUser().email,
      });

      if (this.#fromRecentlyWatched) {
        this.renderVideoPlayer();
      }

      this.handleShowMovie();
      // this.handleWatchTogether();
      // this.handleFavoritesClick();
    } else {
      this.#parent.innerHTML = skeletonTemplate();
    }
  }
}

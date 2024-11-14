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

  constructor(
    parent: HTMLElement,
    onFavoritesClick: () => void,
    onVideoBackClick: (id: number) => void,
  ) {
    this.#parent = parent;
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

    this.ngOnMovieDestroy = () => {
      unsubscribeMovie();
    };

    this.ngOnRoomIdDestroy = () => {
      unsubscribeRoomId();
    };
  }

  ngOnMovieDestroy(): void {}
  ngOnRoomIdDestroy(): void {}

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

  handleSaveTimecode(timeCode: number) {
    if (timeCode < 15) return;

    const moviesString = localStorage.getItem('last_movies');
    if (this.#movie) {
      let parsedMovies: MovieSaved[];
      try {
        if (moviesString) {
          parsedMovies = JSON.parse(moviesString);
          if (!Array.isArray(parsedMovies)) {
            throw new Error('Invalid format');
          }
        } else {
          parsedMovies = [];
        }
      } catch (e) {
        parsedMovies = [];
        throw e;
      }

      const foundMovie = parsedMovies.find((m) => m.id === this.#movie?.id);

      if (foundMovie) {
        foundMovie.timeCode = timeCode;
      } else {
        parsedMovies.push({
          id: this.#movie.id,
          title: this.#movie.title,
          albumImage: this.#movie.albumImage,
          timeCode: timeCode,
        });
      }

      localStorage.setItem('last_movies', JSON.stringify(parsedMovies));
    }
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

  renderTemplate() {
    if (this.#movie) {
      this.setCurrentMovieSelection();
      this.#parent.innerHTML = template({
        movie: this.#movie,
        isUserAuth: !!userStore.getUser().email,
      });
      this.handleShowMovie();
      // this.handleWatchTogether();
      // this.handleFavoritesClick();
    } else {
      this.#parent.innerHTML = skeletonTemplate();
    }
  }
}

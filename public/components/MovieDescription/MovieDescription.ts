import template from './MovieDescription.hbs';
import { moviePageStore } from 'store/MoviePageStore';
import { MovieDetailed, MovieSelection } from 'types/movie';
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

  constructor(
    parent: HTMLElement,
    onFavoritesClick: () => void,
    onVideoBackClick: (id: number) => void,
  ) {
    this.#parent = parent;
    this.#onFavoritesClick = onFavoritesClick;
    this.#onVideoBackClick = onVideoBackClick;
    this.#isModalOpened = false;

    const unsubscribe = moviePageStore.isNewSeriesReceivedEmitter$.addListener(
      () => {
        if (this.#isModalOpened) {
          this.#movie = moviePageStore.getMovie();
          this.renderVideoPlayer();
        }
      },
    );

    this.ngOnDestroy = () => {
      unsubscribe();
    };
  }

  ngOnDestroy(): void {}

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
  //     Actions.createRoom(2);
  //     router.go('/room');
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
    this.setCurrentMovieSelection();
    this.#parent.innerHTML = template({ movie: this.#movie });
    this.handleShowMovie();
    // this.handleWatchTogether();
    // this.handleFavoritesClick();
  }
}

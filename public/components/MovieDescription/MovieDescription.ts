import template from './MovieDescription.hbs';
import { moviePageStore } from 'store/MoviePageStore';
import { MovieDetailed, MovieSelection } from 'types/movie';
import { router } from 'modules/Router';
import { VideoPlayer } from 'components/VideoPlayer/VideoPlayer';
import { Actions } from 'flux/Actions';

export class MovieDescription {
  #parent;
  #movie!: MovieDetailed;
  #movieSelections: MovieSelection[] = [];
  #onFavoritesClick;
  #onVideoBackClick;
  #currentMovieSelection!: MovieSelection;

  constructor(
    parent: HTMLElement,
    onFavoritesClick: () => void,
    onVideoBackClick: () => void,
  ) {
    this.#parent = parent;
    this.#onFavoritesClick = onFavoritesClick;
    this.#onVideoBackClick = onVideoBackClick;

    const unsubscribe = moviePageStore.isNewSeriesReceivedEmitter$.addListener(
      () => {
        this.#movie = moviePageStore.getMovie();
        this.renderVideoPlayer();
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
    console.log('SELECTIONS', this.#movieSelections);
    this.renderTemplate();
  }

  setCurrentMovieSelection() {
    this.#movieSelections.forEach((selection) => {
      if (selection.movies.some((movie) => movie.id === this.#movie.id)) {
        this.#currentMovieSelection = selection;
      }
    });
  }

  getCurrentSeriesId() {
    return this.#currentMovieSelection.movies.findIndex(
      (movie) => movie.id === this.#movie.id,
    );
  }

  onBackClick() {
    const videoContainer = document.getElementById(
      'video-container',
    ) as HTMLElement;

    videoContainer.innerHTML = '';
    videoContainer.style.zIndex = '-1';

    this.#onVideoBackClick();
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
    const videoContainer = document.getElementById(
      'video-container',
    ) as HTMLElement;
    const video = new VideoPlayer(
      videoContainer,
      this.#movie.video,
      this.#currentMovieSelection.movies[
        this.#currentMovieSelection.movies.length - 1
      ].id > this.#movie.id,
      this.#currentMovieSelection.movies[0].id < this.#movie.id,
      this.onBackClick.bind(this),
      undefined,
      undefined,
      undefined,
      undefined,
      this.onNextSeriesClick.bind(this),
      this.onPrevSeriesClick.bind(this),
    );
    video.render();
    videoContainer.style.zIndex = '10';
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

  handleFavoritesClick() {
    const favoritesBtn = document.getElementById(
      'favorites-movie-btn',
    ) as HTMLButtonElement;
    favoritesBtn.addEventListener('click', this.#onFavoritesClick);
  }

  renderTemplate() {
    this.setCurrentMovieSelection();
    this.#parent.innerHTML = template({ movie: this.#movie });
    this.handleShowMovie();
    // this.handleWatchTogether();
    this.handleFavoritesClick();
  }
}

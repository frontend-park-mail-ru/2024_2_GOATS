import template from './MovieDescription.hbs';
import { moviePageStore } from 'store/MoviePageStore';
import { MovieDetailed } from 'types/movie';
import { router } from 'modules/Router';
import { VideoPlayer } from 'components/VideoPlayer/VideoPlayer';

export class MovieDescription {
  #parent;
  #movie!: MovieDetailed;
  #onFavoritesClick;

  constructor(parent: HTMLElement, onFavoritesClick: () => void) {
    this.#parent = parent;
    this.#onFavoritesClick = onFavoritesClick;
  }

  render() {
    this.#movie = moviePageStore.getMovie();
    this.renderTemplate();
  }

  handleShowMovie() {
    const showBtn = document.getElementById(
      'show-movie-btn',
    ) as HTMLButtonElement;
    showBtn.addEventListener('click', () => {
      const moviePage = document.getElementById('movie-page') as HTMLElement;
      const video = new VideoPlayer(moviePage, this.#movie.video, () =>
        router.go('/movie'),
      );
      video.render();
    });
  }

  handleFavoritesClick() {
    const favoritesBtn = document.getElementById(
      'favorites-movie-btn',
    ) as HTMLButtonElement;
    favoritesBtn.addEventListener('click', this.#onFavoritesClick);
  }

  renderTemplate() {
    this.#parent.innerHTML = template({ movie: this.#movie });
    this.handleShowMovie();
    this.handleFavoritesClick();
  }
}

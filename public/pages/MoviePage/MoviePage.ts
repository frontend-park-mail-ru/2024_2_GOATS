import template from './MoviePage.hbs';
import { Loader } from '../../components/Loader/Loader';
import { MovieDetailed } from 'types/movie';
import { moviePageStore } from 'store/MoviePageStore';
import { MovieDescription } from 'components/MovieDescription/MovieDescription';

export class MoviePage {
  #movie!: MovieDetailed;
  #loader!: Loader;

  constructor() {}

  render() {
    console.log('RENDER MOVIE PAGE');
    this.#movie = moviePageStore.getMovie();
    this.renderTemplate();
  }

  renderBlocks() {
    const movieDescriptionContainer = document.getElementById(
      'movie-description-container',
    ) as HTMLElement;
    console.log(movieDescriptionContainer);
    const movieDescription = new MovieDescription(movieDescriptionContainer);
    movieDescription.render();
  }

  renderTemplate() {
    const pageElement = document.getElementsByTagName('main')[0];
    this.#loader = new Loader(pageElement, template());
    if (this.#movie) {
      pageElement.innerHTML = template();
      this.renderBlocks();
    } else {
      this.#loader.render();
    }
  }
}

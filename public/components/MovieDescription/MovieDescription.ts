import template from './MovieDescription.hbs';
import { moviePageStore } from 'store/MoviePageStore';
import { MovieDetailed } from 'types/movie';

export class MovieDescription {
  #parent;
  #movie!: MovieDetailed;

  constructor(parent: HTMLElement) {
    this.#parent = parent;
  }

  render() {
    this.#movie = moviePageStore.getMovie();
    this.renderTemplate();
  }

  renderTemplate() {
    this.#parent.innerHTML = template({ movie: this.#movie });
  }
}

import { Movie } from 'types/movie';
import template from './CardPreview.hbs';
import { yearPicker } from 'modules/TimeFormatter';

export class CardPreview {
  #parent: HTMLElement;
  #movie: Movie;
  #position: DOMRect;

  constructor(movie: Movie, parent: HTMLElement, position: DOMRect) {
    this.#parent = parent;
    this.#movie = movie;
    this.#position = position;
  }

  render() {
    this.renderTemplate();
  }

  renderTemplate() {
    this.#parent.style.position = 'absolute';
    this.#parent.style.left = `${this.#position.x + window.scrollX}px`;
    this.#parent.style.top = `${this.#position.y + window.scrollY}px`;
    this.#parent.style.transform = 'translateZ(0)';
    this.#parent.innerHTML = template({
      movie: this.#movie,
      releaseYear: yearPicker(this.#movie.releaseDate),
    });
  }
}

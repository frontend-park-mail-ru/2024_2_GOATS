import { Movie } from 'types/movie';
import template from './CardPreview.hbs';

const yearPicker = (date: string) => {
  const [day, month, year] = date.split(' ');
  return year;
};

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

  lesten = () => {
    // const cardPreview = document.getElementById(
    //   'card-preview',
    // ) as HTMLSpanElement;
    // const previewBlock = document.getElementById('preview') as HTMLElement;
    // cardPreview.addEventListener('mouseout', () => {
    //   console.log('Мышь покинула карточку');
    //   previewBlock.classList.remove('visible');
    //   previewBlock.innerHTML = '';
    //   // if (timeoutId) clearTimeout(timeoutId);
    // });
  };

  renderTemplate() {
    this.#parent.style.position = 'absolute';
    this.#parent.style.left = `${this.#position.x + window.scrollX}px`;
    this.#parent.style.top = `${this.#position.y + window.scrollY}px`;
    this.#parent.style.transform = 'translateZ(0)';
    this.#parent.innerHTML = template({
      movie: this.#movie,
      releaseYear: yearPicker(this.#movie.releaseDate),
    });

    this.lesten();
  }
}

import { Movie } from 'types/movie';
import template from './GridBlock.hbs';
import { GRID_MOVIES_AMOUNT } from '../../consts';
import { yearPicker } from 'modules/DateFormatter';

export class GridBlock {
  #parent;
  #movies;
  #blockTitle;
  #onImageClick;

  constructor(params: {
    parent: HTMLElement;
    movies: Movie[];
    blockTitle: string;
    onImageClick: (id: number) => void;
  }) {
    this.#parent = params.parent;
    this.#movies = params.movies;
    this.#blockTitle = params.blockTitle;
    this.#onImageClick = params.onImageClick;
  }

  render() {
    this.renderTemplate();
  }

  getTop() {
    return this.#movies.slice(0, GRID_MOVIES_AMOUNT).map((movie) => ({
      ...movie,
      releaseDate: yearPicker(movie.releaseDate),
    }));
  }

  addImagesListeners() {
    const images = this.#parent.querySelectorAll('.grid-block__element');
    images.forEach((img) => {
      img.addEventListener('click', () => {
        const id = Number(img.id.split('image-')[1]);
        this.#onImageClick(id);
      });
    });
  }

  renderTemplate() {
    this.#parent.innerHTML = template({
      items: this.getTop(),
      title: this.#blockTitle,
      // releaseYear: this.getTop(),
    });

    this.addImagesListeners();
  }
}

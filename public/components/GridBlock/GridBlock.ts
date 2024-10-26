import { Movie } from 'types/movie';
import template from './GridBlock.hbs';

export class GridBlock {
  #parent;
  #movies;
  #blockTitle;
  #onImageClick;

  constructor(
    parent: HTMLElement,
    movies: Movie[],
    blockTitle: string,
    onImageClick: (id: number) => void,
  ) {
    this.#parent = parent;
    this.#movies = movies;
    this.#blockTitle = blockTitle;
    this.#onImageClick = onImageClick;
  }

  render() {
    this.renderTemplate();
  }

  getTop() {
    return this.#movies.slice(0, 3);
  }

  addImagesListeners() {
    const images = this.#parent.querySelectorAll('.grid-block__element_image');
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
    });

    this.addImagesListeners();
  }
}

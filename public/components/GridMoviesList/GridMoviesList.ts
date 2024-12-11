import { Movie } from 'types/movie';
import template from './GridMoviesList.hbs';

export class GridMoviesList {
  #onMovieClick;

  constructor(onMovieClick: (id: number) => void) {
    this.#onMovieClick = onMovieClick;
  }

  handleItemClick() {
    const items = document.querySelectorAll('.grid-list__container_item');
    items.forEach((item) => {
      item.addEventListener('click', () => {
        const id = item.id.split('grid-find-id-')[1];
        this.#onMovieClick(Number(id));
      });
    });
  }
  render(items: Movie[], inputValue: string) {
    const isEmpty = inputValue !== '' && items[0].title === undefined;
    const gridContainer = document.getElementById(
      'create-room-modal-find-list',
    ) as HTMLElement;
    gridContainer.innerHTML = template({
      items,
      isEmpty,
    });
    this.handleItemClick();
  }
}

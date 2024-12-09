import { Movie } from 'types/movie';
import template from './GridMoviesList.hbs';
export class GridMoviesList {
  handleItemClick() {
    const items = document.querySelectorAll('.grid-list__container_item');
    items.forEach((item) => {
      item.addEventListener('click', () => {
        const id = item.id.split('grid-find-id-')[1];
        console.log(id);
      });
    });
  }
  render(items: Movie[], inputValue: string) {
    console.log(inputValue, items[0].title);
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

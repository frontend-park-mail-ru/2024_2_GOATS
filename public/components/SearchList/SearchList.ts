import { Movie } from 'types/movie';
import template from './SearchList.hbs';
import { ActorInfo } from 'types/actor';

export class SearchList {
  render(items: Movie[] | ActorInfo[]) {
    this.renderTemplate(items);
  }
  renderTemplate(items: Movie[] | ActorInfo[]) {
    const searchListContainer = document.getElementById(
      'search-list-items-container',
    ) as HTMLElement;
    searchListContainer.innerHTML = template({
      items: items,
    });
  }
}

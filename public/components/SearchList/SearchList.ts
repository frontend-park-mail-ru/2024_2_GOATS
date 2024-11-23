import { Movie } from 'types/movie';
import template from './SearchList.hbs';
import { ActorInfo } from 'types/actor';
import { yearPicker } from 'modules/DateFormatter';
import { findActors, findMovies } from 'types/searchTypes';

export class SearchList {
  render(items: findMovies[] | findActors[], type: string) {
    this.renderTemplate(items, type);
  }

  renderTemplate(items: findMovies[] | findActors[], type: string) {
    const searchListContainer = document.getElementById(
      'search-list-items-container',
    ) as HTMLElement;

    // let findItems;
    // if (type === 'movie') {
    //   findItems = items.map((item) => {
    //     const newItem = { ...item };
    //     if ('releaseDate' in newItem) {
    //       newItem.releaseDate = yearPicker(newItem.releaseDate);
    //     }
    //     return newItem;
    //   });
    // }
    const tmp = type === 'movies';
    console.log(tmp);
    searchListContainer.innerHTML = template({
      tmp: tmp,
      items,
    });
  }
}

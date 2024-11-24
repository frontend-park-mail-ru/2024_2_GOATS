import { Movie } from 'types/movie';
import template from './SearchList.hbs';
import { ActorInfo } from 'types/actor';
import { yearPicker } from 'modules/DateFormatter';
import { findActors, findMovies } from 'types/searchTypes';
import { mainPageStore } from 'store/MainPageStore';

export class SearchList {
  render(items: findMovies[] | findActors[], inputValue: string, type: string) {
    this.renderTemplate(items, inputValue, type);
  }

  renderEmpty() {
    const searchListContainer = document.getElementById(
      'search-list-items-container',
    ) as HTMLElement;
    searchListContainer.innerHTML = template({
      isRecommended: true,
      isMovie: true,
      items: mainPageStore.getSelections()[1].movies,
    });
  }

  renderTemplate(
    items: findMovies[] | findActors[],
    inputValue: string,
    type: string,
  ) {
    const searchListContainer = document.getElementById(
      'search-list-items-container',
    ) as HTMLElement;

    if (items.length === 0 && inputValue === '') {
      this.renderEmpty();
      return;
    }

    const isMovie = type === 'movies';
    searchListContainer.innerHTML = template({
      isNothingFound: items.length === 0,
      isRecommended: false,
      isMovie: isMovie,
      items,
    });
  }
}

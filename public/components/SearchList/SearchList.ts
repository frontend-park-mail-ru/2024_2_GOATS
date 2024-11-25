import { Movie } from 'types/movie';
import template from './SearchList.hbs';
import { ActorInfo } from 'types/actor';
import { yearPicker } from 'modules/DateFormatter';
import { findActors, findMovies } from 'types/searchTypes';
import { mainPageStore } from 'store/MainPageStore';
import { router } from 'modules/Router';
import { searchBlockStore } from 'store/SearchBlockStore';
import { SearchBlock } from 'components/SearchBlock/SearchBlock';

export class SearchList {
  render(
    items: Movie[] | ActorInfo[],
    inputValue: string,
    type: string,
    isEmptyRequest: boolean,
  ) {
    if (isEmptyRequest) {
      this.renderEmpty(type);
      return;
    }
    this.renderTemplate(items, inputValue, type);
  }

  handleItemClick(type?: string) {
    let url: string;
    if (type == 'movies') {
      url = '/movie';
    } else if (type === 'actors') {
      url = '/person';
    }
    const items = document.querySelectorAll('.find-item-list__item');
    items.forEach((item) => {
      item.addEventListener('click', () => {
        const id = item.id.split('find-id-')[1];
        router.go(url, id);
      });
    });
  }

  renderEmpty(type: string) {
    const searchListContainer = document.getElementById(
      'search-list-items-container',
    ) as HTMLElement;

    searchListContainer.innerHTML = template({
      isRecommended: true,
      isMovie: true,
    });

    this.handleItemClick(type);
  }

  renderTemplate(
    items: Movie[] | ActorInfo[],
    inputValue: string,
    type: string,
  ) {
    const searchListContainer = document.getElementById(
      'search-list-items-container',
    ) as HTMLElement;

    if (items.length === 0 && inputValue === '') {
      this.renderEmpty(type);
      return;
    }

    const isMovie = type === 'movies';
    searchListContainer.innerHTML = template({
      isNothingFound: items[0].id === undefined,
      isRecommended: false,
      isMovie: isMovie,
      items,
    });

    this.handleItemClick(type);
  }
}

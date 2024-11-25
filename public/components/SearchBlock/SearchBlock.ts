import { Emitter } from 'modules/Emmiter';
import template from './SearchBlck.hbs';
import { debounce } from 'modules/Debounce';
import { searchBlockStore } from 'store/SearchBlockStore';
import { SearchList } from 'components/SearchList/SearchList';
import { setFocusTimeout } from '../../consts';

const searchList = new SearchList();

export class SearchBlock {
  #selectedItem: 'movies' | 'actors';
  #selectedItemEmmitter: Emitter<'movies' | 'actors'>;

  #inputValue: string;
  #inputValueEmmitter: Emitter<string>;

  constructor() {
    this.#selectedItem = 'movies';
    this.#selectedItemEmmitter = new Emitter<'movies' | 'actors'>('movies');

    this.#inputValue = '';
    this.#inputValueEmmitter = new Emitter<string>('');

    // const dataFetchingListener =
    //   searchBlockStore.dataLoadingEmmitter$.addListener(() => {
    //     this.renderItemsList();
    //   });

    this.ngOnDestroy = () => {
      // dataFetchingListener();
    };
  }

  ngOnDestroy(): void {}

  resetFilters() {
    this.#selectedItem = 'movies';
    this.#inputValue = '';
  }

  get getInputValue() {
    return this.#inputValue;
  }
  get getSelectedCategory() {
    return this.#selectedItem;
  }
  get inputEmmitter$(): Emitter<string> {
    return this.#inputValueEmmitter;
  }
  get navEmmitter$(): Emitter<'movies' | 'actors'> {
    return this.#selectedItemEmmitter;
  }

  renderItemsList(type: string, isEmptyRequest: boolean) {
    searchList.render(
      searchBlockStore.getMovies(),
      this.#inputValue,
      type,
      isEmptyRequest,
    );
  }

  renderTemplate() {
    this.render();
  }

  handleInputChange() {
    const searchInput = document.getElementById(
      'search-bar-input',
    ) as HTMLInputElement;

    const debouncedUpdateValue = debounce((newValue: string) => {
      this.#inputValue = newValue;
      this.#inputValueEmmitter.set(newValue);
    }, 1000);

    searchInput.addEventListener('input', () => {
      debouncedUpdateValue(searchInput.value);
    });
  }

  toggleSearchNav() {
    const personsNav = document.getElementById(
      'search-persons-nav',
    ) as HTMLElement;
    const moviesNav = document.getElementById(
      'search-movies-nav',
    ) as HTMLElement;

    const activeNav = document.getElementById(
      'search-active-nav',
    ) as HTMLElement;

    personsNav.addEventListener('click', () => {
      activeNav.classList.add('persons-selected');
      activeNav.classList.remove('movies-selected');
      this.#selectedItem = 'actors';
      this.#selectedItemEmmitter.set('actors');
    });

    moviesNav.addEventListener('click', () => {
      activeNav.classList.remove('persons-selected');
      activeNav.classList.add('movies-selected');
      this.#selectedItem = 'movies';
      this.#selectedItemEmmitter.set('movies');
    });
  }

  toggleSearchOpen() {
    const searchBar = document.getElementById('search-bar') as HTMLElement;
    const searchInput = document.getElementById(
      'search-bar-input',
    ) as HTMLInputElement;
    const searchButton = document.getElementById(
      'search-bar-search',
    ) as HTMLElement;
    const closeButton = document.getElementById(
      'search-bar-close',
    ) as HTMLElement;
    const searchList = document.getElementById('search-list') as HTMLElement;
    const headerLogo = document.getElementById('header-logo') as HTMLElement;

    function checkScreenWidth() {
      return window.innerWidth < 420;
    }

    searchButton.addEventListener('click', () => {
      searchBar.classList.add('active-search-bar');
      searchList.classList.add('search-list-open');
      setFocusTimeout(searchInput, 100);
      if (checkScreenWidth()) {
        headerLogo.style.display = 'none';
      }
      searchBlockStore.searchRequest();
    });

    closeButton.addEventListener('click', () => {
      searchBar.classList.remove('active-search-bar');
      searchList.classList.remove('search-list-open');
      if (checkScreenWidth()) {
        headerLogo.style.display = 'block';
      }
      searchInput.value = '';
      searchBlockStore.clearFounded();
    });
  }

  render() {
    const searchContainer = document.getElementById(
      'search-bar-container',
    ) as HTMLElement;
    searchContainer.innerHTML = template();
    this.toggleSearchOpen();
    this.toggleSearchNav();
    this.handleInputChange();
  }
}

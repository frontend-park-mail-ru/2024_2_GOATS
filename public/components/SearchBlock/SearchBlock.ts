import { Emitter } from 'modules/Emmiter';
import template from './SearchBlck.hbs';
import { debounce } from 'modules/Debounce';
import { searchBlockStore } from 'store/SearchBlockStore';
import { SearchList } from 'components/SearchList/SearchList';

const searchList = new SearchList();

export class SearchBlock {
  #selectedItem: 'movie' | 'person';
  #selectedItemEmmitter: Emitter<'movie' | 'person'>;

  #inputValue: string;
  #inputValueEmmitter: Emitter<string>;

  constructor() {
    this.#selectedItem = 'movie';
    this.#selectedItemEmmitter = new Emitter<'movie' | 'person'>('movie');

    this.#inputValue = '';
    this.#inputValueEmmitter = new Emitter<string>('');

    // const dataFetchingListener =
    //   searchBlockStore.dataLoadingEmmitter$.addListener(() => {
    //     this.renderItemsList();
    //   });

    // this.ngOnDestroy = () => {
    //   dataFetchingListener();
    // };
  }

  ngOnDestroy(): void {}

  get inputEmmitter$(): Emitter<string> {
    return this.#inputValueEmmitter;
  }
  get navEmmitter$(): Emitter<'movie' | 'person'> {
    return this.#selectedItemEmmitter;
  }

  renderItemsList() {
    console.log(searchBlockStore.getMovies());
    searchList.render(searchBlockStore.getMovies());
  }

  renderTemplate() {
    this.render();
  }

  get getInputValue() {
    return this.#inputValue;
  }
  get getSelectedCategory() {
    return this.#selectedItem;
  }

  //   handleInputChange() {
  //     const searchInput = document.getElementById(
  //       'search-bar-input',
  //     ) as HTMLInputElement;

  //     searchInput.addEventListener('change', () => {
  //       this.#inputValue = searchInput.value;
  //     });
  //   }

  handleInputChange() {
    const searchInput = document.getElementById(
      'search-bar-input',
    ) as HTMLInputElement;

    const debouncedUpdateValue = debounce((newValue: string) => {
      this.#inputValue = newValue;
      this.#inputValueEmmitter.set(newValue);
    }, 1000);

    searchInput.addEventListener('input', () => {
      console.log('999');
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
      this.#selectedItem = 'person';
      this.#selectedItemEmmitter.set('person');
    });

    moviesNav.addEventListener('click', () => {
      activeNav.classList.remove('persons-selected');
      activeNav.classList.add('movies-selected');
      this.#selectedItem = 'movie';
      this.#selectedItemEmmitter.set('movie');
    });
  }

  toggleSearchOpen() {
    const searchBar = document.getElementById('search-bar') as HTMLElement;
    const searchInput = document.getElementById(
      'search-bar-input',
    ) as HTMLElement;
    const searchButton = document.getElementById(
      'search-bar-search',
    ) as HTMLElement;
    const closeButton = document.getElementById(
      'search-bar-close',
    ) as HTMLElement;
    const searchList = document.getElementById('search-list') as HTMLElement;

    searchButton.addEventListener('click', () => {
      searchBar.classList.add('active-search-bar');
      searchList.classList.add('search-list-open');
      setTimeout(() => {
        searchInput.focus();
      }, 100);
    });
    closeButton.addEventListener('click', () => {
      searchBar.classList.remove('active-search-bar');
      searchList.classList.remove('search-list-open');
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

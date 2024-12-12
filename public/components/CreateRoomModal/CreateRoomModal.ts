import { debounce } from 'modules/Debounce';
import template from './CreateRoomModal.hbs';
import { Emitter } from 'modules/Emmiter';
import { searchBlockStore } from 'store/SearchBlockStore';
import { GridMoviesList } from 'components/GridMoviesList/GridMoviesList';
import { Movie } from 'types/movie';
import { mainPageStore } from 'store/MainPageStore';

const gridList = new GridMoviesList();

export class CreateRoomModal {
  #inputValue: string;
  #inputValueEmmitter: Emitter<string>;
  #isModalOpen: boolean;

  constructor() {
    console.log('modal room created');
    this.#isModalOpen = false;
    this.#inputValue = '';
    this.#inputValueEmmitter = new Emitter<string>('');

    const userLoadingListener = searchBlockStore.movEm$.addListener(() => {
      this.renderMoviesList(searchBlockStore.getMovies(), this.#inputValue);
    });
    this.ngOnDestroy = () => {
      userLoadingListener();
    };
  }
  ngOnDestroy(): void {}

  get inputEmmitter$(): Emitter<string> {
    return this.#inputValueEmmitter;
  }

  renderMoviesList(items: Movie[], value: string) {
    if (this.#isModalOpen) {
      if (value === '') {
        gridList.render(mainPageStore.getSelections()[2].movies, value);
      } else {
        gridList.render(items, value);
      }
    }
  }

  handleInputChange() {
    const searchInput = document.getElementById(
      'create-room-search-movie-input',
    ) as HTMLInputElement;

    const debouncedUpdateValue = debounce((newValue: string) => {
      this.#inputValue = newValue;
      searchBlockStore.findMovies(newValue);
    }, 1000);

    searchInput.addEventListener('input', () => {
      debouncedUpdateValue(searchInput.value);
    });
  }

  render() {
    const root = document.getElementById('root');
    if (root) {
      root.insertAdjacentHTML('beforeend', template());
      root.style.overflow = 'hidden';
    }

    const modal = document.getElementById('create-room-modal');
    const modalContent = document.getElementById('create-room-modal-content');
    if (modalContent && modal) {
      modalContent.addEventListener('click', (event) => {
        event.stopPropagation();
      });

      setTimeout(() => {
        modal.classList.add('create-room-modal__active');
        modalContent.classList.add('create-room-modal__content_active');
      }, 0);

      let isDragging = false;
      modalContent.addEventListener('mousedown', () => {
        isDragging = true;
      });

      modal.addEventListener('click', () => {
        if (!isDragging) {
          this.hideModal();
        }
        isDragging = false;
      });
    }
    this.#isModalOpen = true;
    searchBlockStore.findMovies('');
    this.handleInputChange();
    this.handleCloseButtonClick();
  }

  handleCloseButtonClick() {
    const closeButton = document.getElementById(
      'create-room-modal-close-button',
    ) as HTMLElement;
    closeButton.addEventListener('click', () => {
      this.hideModal();
    });
  }

  hideModal() {
    const root = document.getElementById('root');
    const modal = document.getElementById('create-room-modal');
    const modalContent = document.getElementById('create-room-modal-content');

    if (root) {
      root.style.overflow = 'auto';
    }

    if (modal && modalContent) {
      modal.classList.remove('create-room-modal__active');
      modalContent.classList.remove('create-room-modal__content_active');

      // Ждем пока transition завершится и только после этого удаляем модальное окно из DOM
      modal.addEventListener(
        'transitionend',
        () => {
          modal.remove();
        },
        { once: true },
      );
    }
    this.#isModalOpen = false;
    searchBlockStore.clearFounded();
    this.#inputValue = '';
  }

  renderTemplate() {}
}

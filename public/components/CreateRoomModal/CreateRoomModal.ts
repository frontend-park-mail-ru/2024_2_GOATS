import { debounce } from 'modules/Debounce';
import template from './CreateRoomModal.hbs';
import { Emitter } from 'modules/Emmiter';
import { searchBlockStore } from 'store/SearchBlockStore';
import { GridMoviesList } from 'components/GridMoviesList/GridMoviesList';
import { Movie } from 'types/movie';
import { mainPageStore } from 'store/MainPageStore';
import { Actions } from 'flux/Actions';
import { roomPageStore } from 'store/RoomPageStore';
import { router } from 'modules/Router';
import { Notifier } from 'components/Notifier/Notifier';

export class CreateRoomModal {
  #inputValue: string;
  #inputValueEmmitter: Emitter<string>;
  #isModalOpen: boolean;
  #onClick;

  constructor(onClick?: (id: number) => void) {
    this.#isModalOpen = false;
    this.#inputValue = '';
    this.#inputValueEmmitter = new Emitter<string>('');
    this.#onClick = onClick;

    const userLoadingListener = searchBlockStore.movEm$.addListener(() => {
      this.renderMoviesList(searchBlockStore.getMovies(), this.#inputValue);
    });
    this.ngOnDestroy = () => {
      userLoadingListener();
    };

    const unsubscribeRoomId = roomPageStore.isCreatedRoomReceived$.addListener(
      () => {
        if (roomPageStore.getCreatedRoomId()) {
          roomPageStore.setIsModalConfirm(true);
          router.go('/room', roomPageStore.getCreatedRoomId());

          const notifier = new Notifier(
            'success',
            'Комната успешно создана',
            3000,
          );

          notifier.render();
        }
      },
    );

    this.ngOnRoomIdDestroy = () => {
      unsubscribeRoomId();
    };
  }

  ngOnRoomIdDestroy(): void {}
  ngOnDestroy(): void {}

  get inputEmmitter$(): Emitter<string> {
    return this.#inputValueEmmitter;
  }

  renderMoviesList(items: Movie[], value: string) {
    if (this.#isModalOpen) {
      const gridList = new GridMoviesList(this.onMovieClick.bind(this));

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

  onMovieClick(id: number) {
    if (this.#onClick) {
      this.#onClick(Number(id));
    } else {
      Actions.createRoom(Number(id));
    }

    this.hideModal();
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

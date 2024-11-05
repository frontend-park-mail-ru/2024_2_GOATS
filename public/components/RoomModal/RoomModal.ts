import template from './RoomModal.hbs';
import { MovieDetailed } from 'types/movie';

export class RoomModal {
  #text;
  #movie;
  #onConfirm;
  #onCancel;

  constructor(params: {
    text: string;
    movie: MovieDetailed;
    onConfirm: () => void;
    onCancel?: () => void;
  }) {
    this.#text = params.text;
    this.#onConfirm = params.onConfirm;
    this.#onCancel = params.onCancel;
    this.#movie = params.movie;
  }

  render() {
    const root = document.getElementById('root');
    if (root) {
      root.insertAdjacentHTML(
        'beforeend',
        template({ text: this.#text, movie: this.#movie }),
      );
      root.style.overflow = 'hidden';
    }

    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    if (modalContent && modal) {
      modalContent.addEventListener('click', (event) => {
        event.stopPropagation();
      });

      setTimeout(() => {
        modal.classList.add('modal__active');
        modalContent.classList.add('modal__content_active');
      }, 0);

      modal.addEventListener('click', () => this.hideModal());
    }

    const confirmButton = document.getElementById('modal-create-btn');
    const cancelButton = document.getElementById('modal-cancel-btn');

    if (confirmButton && cancelButton) {
      confirmButton.addEventListener('click', () => {
        this.#onConfirm();
        this.hideModal();
      });

      cancelButton.addEventListener('click', () => {
        if (this.#onCancel) {
          this.#onCancel();
        }
        this.hideModal();
      });
    }
  }

  hideModal() {
    const root = document.getElementById('root');
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');

    if (root) {
      root.style.overflow = 'auto';
    }

    if (modal && modalContent) {
      modal.classList.remove('modal__active');
      modalContent.classList.remove('modal__content_active');

      // Ждем пока transition завершится и только после этого удаляем модальное окно из DOM
      modal.addEventListener(
        'transitionend',
        () => {
          modal.remove();
        },
        { once: true },
      );
    }
  }

  renderTemplate() {}
}

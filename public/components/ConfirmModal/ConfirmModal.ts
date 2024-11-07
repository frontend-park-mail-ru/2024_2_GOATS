import template from './ConfirmModal.hbs';

export class ConfirmModal {
  #text;
  #onConfirm;
  #onCancel;
  #hideByBackground;

  constructor(
    text: string,
    hideByBackground: boolean,
    onConfirm: () => void,
    onCancel?: () => void,
  ) {
    this.#text = text;
    this.#hideByBackground = hideByBackground;
    this.#onConfirm = onConfirm;
    this.#onCancel = onCancel;
  }

  render() {
    const root = document.getElementById('root');
    if (root) {
      root.insertAdjacentHTML('beforeend', template({ text: this.#text }));
      root.style.overflow = 'hidden';
    }

    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    if (modalContent && modal) {
      modalContent.addEventListener('click', (event) => {
        console.log('in');
        event.stopPropagation();
      });

      setTimeout(() => {
        modal.classList.add('modal__active');
        modalContent.classList.add('modal__content_active');
      }, 0);

      let isDragging = false;
      modalContent.addEventListener('mousedown', () => {
        isDragging = true;
      });

      modal.addEventListener('click', () => {
        if (!isDragging && this.#hideByBackground) {
          this.hideModal();
        }
        isDragging = false;
      });
    }

    const confirmButton = document.getElementById('modal-confirm-btn');
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

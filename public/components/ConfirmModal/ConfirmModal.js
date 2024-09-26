import template from './ConfirmModal.hbs';

export class ConfirmModal {
  #text;
  #onConfirm;
  #onCancel;

  constructor(text, onConfirm, onCancel) {
    this.#text = text;
    this.#onConfirm = onConfirm;
    this.#onCancel = onCancel;
  }

  render() {
    const root = document.getElementById('root');
    root.insertAdjacentHTML('beforeend', template({ text: this.#text }));
    root.style.overflow = 'hidden';

    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    modalContent.addEventListener('click', (event) => {
      event.stopPropagation();
    });

    setTimeout(() => {
      modal.classList.add('modal__active');
      modalContent.classList.add('modal__content_active');
    }, 0);

    modal.addEventListener('click', () => this.hideModal());

    const confirmButton = document.getElementById('modal-confirm-btn');
    const cancelButton = document.getElementById('modal-cancel-btn');

    confirmButton.addEventListener('click', () => {
      if (this.#onConfirm) {
        this.#onConfirm();
      }
      this.hideModal();
    });

    cancelButton.addEventListener('click', () => {
      if (this.#onCancel) {
        this.#onCancel();
      }
      this.hideModal();
    });
  }

  hideModal() {
    const root = document.getElementById('root');
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');

    root.style.overflow = 'auto';

    if (modal) {
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

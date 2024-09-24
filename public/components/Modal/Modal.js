export class Modal {
  #content;

  constructor(content) {
    this.#content = content;
  }

  showModal() {
    const template = Handlebars.templates['Modal.hbs'];
    const root = document.getElementById('root');
    root.insertAdjacentHTML('beforeend', template());
    root.style.overflow = 'hidden';

    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');

    setTimeout(() => {
      modal.classList.add('modal__active');
      modalContent.classList.add('modal__content_active');
    }, 0);

    if (this.#content instanceof HTMLElement) {
      modalContent.appendChild(this.#content);
    } else {
      modalContent.innerHTML = this.#content;
    }
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

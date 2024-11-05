import template from './Notifier.hbs';

export class Notifier {
  #type;
  #content;
  #liveTime;

  constructor(type: string, content: string, liveTime: number) {
    this.#type = type;
    this.#content = content;
    this.#liveTime = liveTime;
  }

  render() {
    this.renderTemplate();
    this.showNotifier();
  }

  showNotifier() {
    const notifierBlock = document.getElementById('notifier-block');

    setTimeout(() => {
      if (notifierBlock) {
        notifierBlock.classList.add('visible');
      }
    });

    setTimeout(() => {
      this.hideNotifier();
    }, this.#liveTime);
  }

  handleCloseButtonClick() {
    const closeButton = document.getElementById('notifier-close-button');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        this.hideNotifier();
      });
    }
  }

  hideNotifier() {
    const notifierBlock = document.getElementById('notifier-block');
    if (notifierBlock) {
      notifierBlock.classList.remove('visible');
    }

    const notifierWrapper = document.getElementById('notifier');
    setTimeout(() => {
      if (notifierWrapper) {
        notifierWrapper.innerHTML = '';
      }
    }, 300);
  }

  renderTemplate() {
    const notifierWrapper = document.getElementById('notifier');
    if (notifierWrapper) {
      notifierWrapper.innerHTML = template({
        notificationType: this.#type,
        notificationText: this.#content,
      });
    }
    this.handleCloseButtonClick();
  }
}

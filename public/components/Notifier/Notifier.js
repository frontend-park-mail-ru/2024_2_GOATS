export class Notifier {
  #type;
  #content;
  #liveTime;

  constructor(type, content, liveTime) {
    this.#type = type;
    this.#content = content;
    this.#liveTime = liveTime;
  }

  render() {
    this.renderTemplate();
    this.showNotifier();
  }

  /**
   * add notifier to layout for exact time
   * @param {}
   * @returns {}
   */
  showNotifier() {
    const notifierBlock = document.getElementById('notifier-block');

    setTimeout(() => {
      notifierBlock.classList.add('visible');
    });

    setTimeout(() => {
      this.hideNotifier();
    }, this.#liveTime);
  }

  /**
   * add listener for notifier closing
   * @param {}
   * @returns {}
   */
  handleCloseButtonClick() {
    const closeButton = document.getElementById('notifier-close-button');
    closeButton.addEventListener('click', () => {
      this.hideNotifier();
    });
  }

  /**
   * remove notifier from layout
   * @param {}
   * @returns {}
   */
  hideNotifier() {
    const notifierBlock = document.getElementById('notifier-block');
    notifierBlock.classList.remove('visible');

    const notifierWrapper = document.getElementById('notifier');
    setTimeout(() => {
      notifierWrapper.innerHTML = '';
    }, 300);
  }

  renderTemplate() {
    const template = Handlebars.templates['Notifier.hbs'];

    const notifierWrapper = document.getElementById('notifier');
    notifierWrapper.innerHTML = template({
      notificationType: this.#type,
      notificationText: this.#content,
    });
    this.handleCloseButtonClick();
  }
}

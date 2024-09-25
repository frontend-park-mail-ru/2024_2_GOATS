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

  showNotifier() {
    const notifierBlock = document.getElementById('notifier-block');

    setTimeout(() => {
      notifierBlock.classList.add('visible');
    }, 100);

    setTimeout(() => {
      this.hideNotifier();
    }, this.#liveTime);
  }

  hideNotifier() {
    const notifierBlock = document.getElementById('notifier-block');
    notifierBlock.classList.remove('visible');

    setTimeout(() => {
      notifierBlock.innerHTML = '';
    }, 300);
  }

  renderTemplate() {
    const template = Handlebars.templates['Notifier.hbs'];

    const notifierWrapper = document.getElementById('notifier');
    notifierWrapper.innerHTML = template({
      notificationType: this.#type,
      notificationText: this.#content,
    });
  }
}

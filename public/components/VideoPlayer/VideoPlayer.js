import template from './VideoPlayer.hbs';

export class VideoPlayer {
  #parent;
  #url;

  constructor(parent, url) {
    this.#parent = parent;
    this.#url = url;
  }

  render() {
    this.renderTemplate();
  }

  renderTemplate() {
    this.#parent.insertAdjacentHTML('beforeend', template({ url: this.#url }));
  }
}

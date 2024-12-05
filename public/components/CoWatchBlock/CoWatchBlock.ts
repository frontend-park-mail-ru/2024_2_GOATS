import template from './CoWatchBlock.hbs';
export class CoWatchBlock {
  #parent: HTMLElement;

  constructor(parent: HTMLElement) {
    this.#parent = parent;
  }
  render() {
    this.renderTemplate();
  }
  renderTemplate() {
    this.#parent.innerHTML = template();
  }
}

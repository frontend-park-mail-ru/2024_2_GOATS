import template from './AvatarComponent.hbs';

export class AvatarComponent {
  #parent;
  #image;

  constructor(parent: HTMLElement, image: string) {
    this.#parent = parent;
    this.#image = image;
  }

  render() {
    this.renderTemplate();
  }
  renderTemplate() {
    this.#parent.innerHTML = '';
    this.#parent.innerHTML = template({ image: this.#image });
  }
}

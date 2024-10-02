import template from './Loader.hbs';

export class Loader {
  // parent нужен для того, чтобы понимать где отображать лоадер
  #parent;
  // Элемент позволяет вернуть содержимое parent-а после того, как контент загрузился
  #element;

  constructor(parent: HTMLElement, element: string) {
    this.#parent = parent;
    this.#element = element;
  }

  render() {
    this.#parent.innerHTML = template();
  }

  /**
   * Delete loader from page and show loaded page
   * @param {}
   * @returns {}
   */
  kill() {
    this.#parent.innerHTML = this.#element;
  }
}

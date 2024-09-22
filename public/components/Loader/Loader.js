export class Loader {
  // parent нужен для того, чтобы понимать где отображать лоадер
  #parent;
  // Элемент позволяет вернуть содержимое parent-а после того, как контент загрузился
  #element;

  constructor(parent, element) {
    this.#parent = parent;
    this.#element = element;
  }

  render() {
    const template = Handlebars.templates['Loader.hbs'];
    console.log('parent is', this.#parent);
    this.#parent.innerHTML = template();
  }

  kill() {
    this.#parent.innerHTML = this.#element;
  }
}

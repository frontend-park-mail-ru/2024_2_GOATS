export class Menu {
  #parent;
  #config;
  constructor(parent, config) {
    this.#parent = parent;
    this.#config = config;

    this.state = {
      activeMenuLink: null,
      menuElements: {},
    };
  }

  get config() {
    return this.#config;
  }

  render() {
    this.renderTemplate();
  }

  get items() {
    return Object.entries(this.config.menu);
  }

  renderTemplate() {
    const template = Handlebars.templates['Menu.hbs'];
    const items = this.items.map(([key, { text }], index) => {
      let className = 'menu-item';
      if (index === 0) {
        className += ' active';
      }
      return { key, text, className };
    });
    this.#parent.innerHTML = template({ items });
    this.#parent.querySelectorAll('a').forEach((element) => {
      this.state.menuElements[element.dataset.section] = element;
    });
  }
}

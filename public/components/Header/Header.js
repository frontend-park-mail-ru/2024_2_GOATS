export class Header {
  #parent;
  #config;

  constructor(parent, config) {
    this.#parent = parent;
    this.#config = config;

    this.state = {
      activeHeaderLink: null,
      navElements: {},
    };
  }

  get config() {
    return this.#config;
  }

  render() {
    this.renderTemplate();
  }

  // items - страницы-линки в хэдере
  get items() {
    return Object.entries(this.config.pages);
  }

  renderTemplate() {
    const template = Handlebars.templates['Header.hbs'];
    const items = this.items.map(([key, { text, href }], index) => {
      let className = '';
      if (index === 0) {
        className += 'active';
      }
      return { key, text, href, className };
    });
    this.#parent.innerHTML = template({ items });
    this.#parent.querySelectorAll('a').forEach((element) => {
      this.state.navElements[element.dataset.section] = element;
    });
  }
}
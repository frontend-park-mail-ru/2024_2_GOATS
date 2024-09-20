export class Loader {
  #pageId;

  constructor(pageId) {
    this.#pageId = pageId;
  }

  showLoader() {
    const loader = document.getElementById('global-loader');
    console.log(loader);
    const mainContent = document.getElementById(this.#pageId);

    if (loader) {
      loader.style.display = 'block';
    }
    if (mainContent) {
      mainContent.style.display = 'none';
    }
  }

  hideLoader() {
    const loader = document.getElementById('global-loader');
    const mainContent = document.getElementById(this.#pageId);
    if (loader) {
      loader.style.display = 'none';
    }
    if (mainContent) {
      mainContent.style.display = 'block';
    }
  }

  render() {
    this.renderTemplate();
  }

  renderTemplate() {
    const template = Handlebars.templates['MainPage.hbs'];
    const rootElement = document.getElementById('root');
    rootElement.appendChild = template();

    this.getBestMovies();
    this.getNewMovies();
  }
}

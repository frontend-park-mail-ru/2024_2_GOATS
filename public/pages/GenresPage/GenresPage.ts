import template from './GenresPage.hbs';

export class GenresPage {
  render() {
    this.renderTemplate();
  }
  renderTemplate() {
    const pageElement = document.getElementsByTagName('main')[0];
    pageElement.innerHTML = template();
  }
}

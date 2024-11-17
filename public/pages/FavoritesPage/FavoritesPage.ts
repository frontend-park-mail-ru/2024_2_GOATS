import template from './FavoritesPage.hbs';

export class FavoritesPage {
  render() {
    this.renderTemplate();
  }
  renderTemplate() {
    const pageElement = document.getElementsByTagName('main')[0];
    pageElement.innerHTML = template();
  }
}

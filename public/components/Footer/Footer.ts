import template from './Footer.hbs';

export class Footer {
  render(url: string) {
    this.renderTemplate(url);
  }

  renderTemplate(url: string) {
    const footerParent = document.getElementsByTagName('footer')[0];
    footerParent.innerHTML = '';

    if (!(url == '/auth' || url == '/registration')) {
      footerParent.innerHTML = template();
    }
  }
}

export const footer = new Footer();

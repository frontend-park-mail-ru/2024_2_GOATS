import { RegForm } from '../../components/RegForm/RegForm';
import template from './RegPage.hbs';

export class RegPage {
  #parent: HTMLElement;

  constructor() {
    this.#parent = document.getElementsByTagName('main')[0];
  }

  render() {
    this.renderTemplate();
  }

  renderTemplate() {
    const rootElem = document.getElementById('root');
    if (rootElem) {
      rootElem.classList.remove('root-black');
      rootElem.classList.add('root-image');
    }

    this.#parent.innerHTML = template();

    const regForm = document.getElementById('reg-page-form-block');
    if (regForm) {
      const form = new RegForm(regForm);
      form.render();
    }
  }
}

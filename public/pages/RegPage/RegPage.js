import { RegForm } from '../../components/RegForm/RegForm';
import template from './RegPage.hbs';

export class RegPage {
  #parent;

  constructor(parent) {
    this.#parent = parent;
  }

  render() {
    this.renderTemplate();
  }

  renderTemplate() {
    const rootElem = document.getElementById('root');
    rootElem.classList.remove('root-black');
    rootElem.classList.add('root-image');

    this.#parent.innerHTML = template();

    const regForm = document.getElementById('reg-page-form-block');
    const form = new RegForm(regForm);
    form.render();
  }
}

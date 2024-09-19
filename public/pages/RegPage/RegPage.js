import { RegForm } from '../../components/RegForm/RegForm';

export class RegPage {
  #parent;

  constructor(parent) {
    this.#parent = parent;
  }

  render() {
    this.renderTemplate();
  }

  renderTemplate() {
    const template = Handlebars.templates['RegPage.hbs'];
    this.#parent.innerHTML = template();

    const regForm = document.getElementById('reg-page-form-block');
    const form = new RegForm(regForm);
    form.render();
  }
}

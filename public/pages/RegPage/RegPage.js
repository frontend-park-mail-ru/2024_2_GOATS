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
    // По-другому root именно для этой страницы не перекрасить (через css не очень)
    const rootElem = document.getElementById('root');
    rootElem.classList.remove('root-black');
    rootElem.classList.add('root-image');

    const template = Handlebars.templates['RegPage.hbs'];
    this.#parent.innerHTML = template();

    const regForm = document.getElementById('reg-page-form-block');
    const form = new RegForm(regForm);
    form.render();
  }
}

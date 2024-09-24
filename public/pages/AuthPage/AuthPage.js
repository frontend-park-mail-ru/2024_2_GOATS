import { AuthForm } from '../../components/AuthForm/AuthForm';

export class AuthPage {
  #parent;

  constructor(parent) {
    this.#parent = parent;
  }

  render() {
    this.renderTemplate();
  }

  renderTemplate() {
    // По-другому root не перекрасить
    const rootElem = document.getElementById('root');
    rootElem.classList.remove('root-black');
    rootElem.classList.add('root-image');

    const template = Handlebars.templates['AuthPage.hbs'];
    this.#parent.innerHTML = template();

    const authForm = document.getElementById('auth-page-form-block');
    const form = new AuthForm(authForm);
    form.render();
  }
}

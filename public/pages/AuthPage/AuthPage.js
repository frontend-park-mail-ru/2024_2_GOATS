import { AuthForm } from '../../components/AuthForm/AuthForm';
import template from './AuthPage.hbs';

export class AuthPage {
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

    const authForm = document.getElementById('auth-page-form-block');
    const form = new AuthForm(authForm);
    form.render();
  }
}

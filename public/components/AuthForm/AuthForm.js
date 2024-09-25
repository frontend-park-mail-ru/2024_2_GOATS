import { goToPage } from '../..';
import { apiClient } from '../../modules/ApiClient';
import {
  validateEmailAddress,
  validatePassword,
} from '../../modules/Validators';
import { Notifier } from '../Notifier/Notifier';

export class AuthForm {
  #parent;
  #config;

  constructor(parent) {
    this.#parent = parent;
  }

  get config() {
    return this.#config;
  }

  validateFormFields(emailValue, passwordValue) {
    const emailInput = document.getElementById('form-auth-email');
    const passwordInput = document.getElementById('form-auth-password');

    if (!validateEmailAddress(emailValue) || !validatePassword(passwordValue)) {
      if (!validateEmailAddress(emailValue)) {
        emailInput.classList.add('input-error');
      } else {
        emailInput.classList.remove('input-error');
      }
      if (!validatePassword(passwordValue)) {
        passwordInput.classList.add('input-error');
      } else {
        passwordInput.classList.remove('input-error');
      }
      return false;
    } else {
      emailInput.classList.remove('input-error');
      passwordInput.classList.remove('input-error');

      return true;
    }
  }

  async authRequest(emailValue, passwordValue) {
    const response = await apiClient.post({
      path: 'tasks',
      body: { email: emailValue, password: passwordValue },
    });
  }

  onAuthButtonClick() {
    const authBtn = document.getElementById('form-auth-btn');
    authBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const emailValue = document.getElementById('form-auth-email').value;
      const passwordValue = document.getElementById('form-auth-password').value;

      if (!this.validateFormFields(emailValue, passwordValue)) {
        return;
      }

      this.authRequest(emailValue, passwordValue);
    });
  }

  handleRegLinkClick() {
    const regLink = document.getElementById('form-auth-reg-link');
    regLink.addEventListener('click', (e) => {
      e.preventDefault();
      goToPage(document.querySelector(`[data-section="signup"]`));
    });
  }

  test() {
    const testEl = document.getElementsByClassName('form-auth__title')[0];
    testEl.addEventListener('click', () => {
      const note = new Notifier(
        'error',
        'Нет пользователя с таким e-mail',
        3000,
      );

      note.render();
    });
  }

  render() {
    this.renderTemplate();
    this.onAuthButtonClick();
    this.handleRegLinkClick();
    this.test();
  }

  renderTemplate() {
    const template = Handlebars.templates['AuthForm.hbs'];
    this.#parent.innerHTML = template();
  }
}

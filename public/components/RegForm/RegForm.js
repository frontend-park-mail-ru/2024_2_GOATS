import { goToPage } from '../..';
import { apiClient } from '../../modules/ApiClient';

import {
  validateEmailAddress,
  validatePassword,
  validateLogin,
} from '../../modules/Validators';
import { Notifier } from '../Notifier/Notifier';

export class RegForm {
  #parent;
  #config;

  constructor(parent) {
    this.#parent = parent;
  }

  get config() {
    return this.#config;
  }

  validateFormFields(loginValue, emailValue, passwordValue, confirmValue) {
    const emailInput = document.getElementById('form-reg-email');
    const loginInput = document.getElementById('form-reg-login');
    const passwordInput = document.getElementById('form-reg-password');
    const passwordConfirmInput = document.getElementById(
      'form-reg-password-confirm',
    );

    if (
      !validateEmailAddress(emailValue) ||
      !validatePassword(passwordValue) ||
      !validateLogin(loginValue) ||
      passwordValue != confirmValue
    ) {
      if (!validateEmailAddress(emailValue)) {
        emailInput.classList.add('input-error');
      } else {
        emailInput.classList.remove('input-error');
      }

      if (!validateLogin(loginValue)) {
        loginInput.classList.add('input-error');
      } else {
        loginInput.classList.remove('input-error');
      }

      if (!validatePassword(passwordValue)) {
        passwordInput.classList.add('input-error');
      } else {
        passwordInput.classList.remove('input-error');
      }
      if (passwordValue != confirmValue) {
        passwordConfirmInput.classList.add('input-error');
      } else {
        passwordConfirmInput.classList.remove('input-error');
      }
      return false;
    } else {
      emailInput.classList.remove('input-error');
      loginInput.classList.remove('input-error');
      passwordInput.classList.remove('input-error');
      passwordConfirmInput.classList.remove('input-error');

      return true;
    }
  }

  async regRequest(loginValue, emailValue, passwordValue, confirmValue) {
    const response = await apiClient.post({
      path: 'tasks',
      body: {
        email: emailValue,
        login: loginValue,
        password: passwordValue,
        passwordConfirm: confirmValue,
      },
    });
  }

  onRegButtonClick() {
    const regBtn = document.getElementById('form-reg-btn');
    regBtn.addEventListener('click', async (e) => {
      e.preventDefault();

      const emailValue = document.getElementById('form-reg-email').value;
      const loginValue = document.getElementById('form-reg-login').value;
      const passwordValue = document.getElementById('form-reg-password').value;
      const confirmValue = document.getElementById(
        'form-reg-password-confirm',
      ).value;

      if (
        !this.validateFormFields(
          loginValue,
          emailValue,
          passwordValue,
          confirmValue,
        )
      ) {
        return;
      }
      this.regRequest(loginValue, emailValue, passwordValue, confirmValue);
    });
  }

  handleAuthLinkClick() {
    const authLink = document.getElementById('form-reg-auth-link');
    authLink.addEventListener('click', (e) => {
      e.preventDefault();
      goToPage(document.querySelector(`[data-section="login"]`));
    });
  }

  test() {
    const testEl = document.getElementsByClassName('form-reg__title')[0];
    testEl.addEventListener('click', () => {
      const note = new Notifier('success', 'Успешно', 3000);

      note.render();
    });
  }

  render() {
    this.renderTemplate();
    this.onRegButtonClick();
    this.handleAuthLinkClick();
    this.test();
  }

  renderTemplate() {
    const template = Handlebars.templates['RegForm.hbs'];
    this.#parent.innerHTML = template();
  }
}

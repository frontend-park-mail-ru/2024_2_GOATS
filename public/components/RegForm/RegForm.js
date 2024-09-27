import { goToPage } from '../..';
import { apiClient } from '../../modules/ApiClient';
import template from './RegForm.hbs';

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

  validateEmailField(emailValue) {
    const emailInput = document.getElementById('form-reg-email');
    const emailError = document.getElementById('form-reg-email-error');

    if (!validateEmailAddress(emailValue)) {
      emailInput.classList.add('input-error');
      emailError.innerText = 'Некорректный e-mail';
      return false;
    } else {
      emailInput.classList.remove('input-error');
      emailError.innerText = '';
      return true;
    }
  }

  validateLoginField(loginValue) {
    const loginInput = document.getElementById('form-reg-login');
    const loginError = document.getElementById('form-reg-login-error');
    if (validateLogin(loginValue)) {
      loginInput.classList.add('input-error');
      loginError.innerText = validateLogin(loginValue);
      return false;
    } else {
      loginInput.classList.remove('input-error');
      loginError.innerText = '';
      return true;
    }
  }

  validatePasswordField(passwordValue) {
    const passwordInput = document.getElementById('form-reg-password');
    const passwordError = document.getElementById('form-reg-password-error');

    if (validatePassword(passwordValue)) {
      passwordInput.classList.add('input-error');
      passwordError.innerText = validatePassword(passwordValue);

      return false;
    } else {
      passwordInput.classList.remove('input-error');
      passwordError.innerText = '';
      return true;
    }
  }

  validatePasswordConrirmField(passwordValue, passwordConfirmValue) {
    const passwordConfirmInput = document.getElementById(
      'form-reg-password-confirm',
    );
    const passwordConfirmError = document.getElementById(
      'form-reg-password-confirm-error',
    );

    if (passwordValue !== passwordConfirmValue) {
      passwordConfirmInput.classList.add('input-error');
      passwordConfirmError.innerText = 'Пароли должны совпадать';
      return false;
    } else {
      passwordConfirmInput.classList.remove('input-error');
      passwordConfirmError.innerText = '';
      return true;
    }
  }

  throwRegError(authErrorMessage) {
    const errorBlock = document.getElementById('reg-error');
    errorBlock.innerHTML = authErrorMessage;
    errorBlock.classList.add('visible');
  }

  removeRegError() {
    const errorBlock = document.getElementById('reg-error');
    errorBlock.innerHTML = '';
    errorBlock.classList.remove('visible');
  }

  async regRequest(loginValue, emailValue, passwordValue, confirmValue) {
    try {
      const response = await apiClient.post({
        path: 'tasks',
        body: {
          email: emailValue,
          login: loginValue,
          password: passwordValue,
          passwordConfirm: confirmValue,
        },
      });
      // throw Error; // TODO: нужен бэк
    } catch {
      this.throwRegError('Пользователь с таким e-mail уже есть');
    }
  }

  /**
   * Processing of clicking on the registration button
   * @param {}
   * @returns {}
   */
  onRegButtonClick() {
    const regBtn = document.getElementById('form-reg-btn');
    regBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      this.removeRegError();

      const emailValue = document.getElementById('form-reg-email').value;
      const loginValue = document.getElementById('form-reg-login').value;
      const passwordValue = document.getElementById('form-reg-password').value;
      const confirmValue = document.getElementById(
        'form-reg-password-confirm',
      ).value;

      const isEmailValid = this.validateEmailField(emailValue);
      const isLoginValid = this.validateLoginField(loginValue);
      const isPasswordValid = this.validatePasswordField(passwordValue);
      const isPasswordConfirmValid = this.validatePasswordConrirmField(
        passwordValue,
        confirmValue,
      );

      if (
        !isEmailValid ||
        !isPasswordValid ||
        !isLoginValid ||
        !isPasswordConfirmValid
      ) {
        return;
      }
      this.regRequest(loginValue, emailValue, passwordValue, confirmValue);
    });
  }

  /**
   * Navigate to authorization
   * @param {}
   * @returns {}
   */
  handleAuthLinkClick() {
    const authLink = document.getElementById('form-reg-auth-link');
    authLink.addEventListener('click', (e) => {
      e.preventDefault();
      goToPage(document.querySelector(`[data-section="login"]`));
    });
  }

  render() {
    this.renderTemplate();
    this.onRegButtonClick();
    this.handleAuthLinkClick();
  }

  renderTemplate() {
    this.#parent.innerHTML = template();
  }
}

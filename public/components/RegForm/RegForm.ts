// import { goToPage } from '../..';
import { apiClient } from '../../modules/ApiClient';
import template from './RegForm.hbs';

import {
  validateEmailAddress,
  validatePassword,
  validateLogin,
} from '../../modules/Validators';

export class RegForm {
  #parent;

  constructor(parent: HTMLElement) {
    this.#parent = parent;
  }

  validateEmailField(emailValue: string) {
    const emailInput = document.getElementById('form-reg-email') as HTMLElement;
    const emailError = document.getElementById(
      'form-reg-email-error',
    ) as HTMLElement;

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

  validateLoginField(loginValue: string) {
    const loginInput = document.getElementById('form-reg-login') as HTMLElement;
    const loginError = document.getElementById(
      'form-reg-login-error',
    ) as HTMLElement;
    if (validateLogin(loginValue)) {
      loginInput.classList.add('input-error');
      const error = validateLogin(loginValue);
      if (error) {
        loginError.innerText = error;
      }
      return false;
    } else {
      loginInput.classList.remove('input-error');
      loginError.innerText = '';
      return true;
    }
  }

  validatePasswordField(passwordValue: string) {
    const passwordInput = document.getElementById(
      'form-reg-password',
    ) as HTMLElement;
    const passwordError = document.getElementById(
      'form-reg-password-error',
    ) as HTMLElement;

    if (validatePassword(passwordValue)) {
      passwordInput.classList.add('input-error');
      const error = validatePassword(passwordValue);
      if (error) {
        passwordError.innerText = error;
      }

      return false;
    } else {
      passwordInput.classList.remove('input-error');
      passwordError.innerText = '';
      return true;
    }
  }

  validatePasswordConrirmField(
    passwordValue: string,
    passwordConfirmValue: string,
  ) {
    const passwordConfirmInput = document.getElementById(
      'form-reg-password-confirm',
    ) as HTMLElement;
    const passwordConfirmError = document.getElementById(
      'form-reg-password-confirm-error',
    ) as HTMLElement;

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

  throwRegError(authErrorMessage: string) {
    const errorBlock = document.getElementById('reg-error') as HTMLElement;
    errorBlock.innerHTML = authErrorMessage;
    errorBlock.classList.add('visible');
  }

  removeRegError() {
    const errorBlock = document.getElementById('reg-error') as HTMLElement;
    errorBlock.innerHTML = '';
    errorBlock.classList.remove('visible');
  }

  async regRequest(
    loginValue: string,
    emailValue: string,
    passwordValue: string,
    confirmValue: string,
  ) {
    try {
      await apiClient.post({
        path: 'auth/signup',
        body: {
          email: emailValue,
          username: loginValue,
          password: passwordValue,
          passwordConfirmation: confirmValue,
        },
      });

      const filmsNav = document.querySelector(
        `[data-section="films"]`,
      ) as HTMLElement;

      if (filmsNav) {
        // goToPage(filmsNav);
      }
    } catch (e: any) {
      if (e.status === 409) {
        this.throwRegError('Такой пользователь уже существует');
      } else {
        this.throwRegError('Что-то пошло не так. Попробуйте позже');
      }
    }
  }

  onRegButtonClick() {
    const regBtn = document.getElementById('form-reg-btn') as HTMLElement;
    regBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      this.removeRegError();

      const emailValue = (<HTMLInputElement>(
        document.getElementById('form-reg-email')
      )).value;
      const loginValue = (<HTMLInputElement>(
        document.getElementById('form-reg-login')
      )).value;
      const passwordValue = (<HTMLInputElement>(
        document.getElementById('form-reg-password')
      )).value;
      const confirmValue = (<HTMLInputElement>(
        document.getElementById('form-reg-password-confirm')
      )).value;

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

  handleAuthLinkClick() {
    const authLink = document.getElementById(
      'form-reg-auth-link',
    ) as HTMLElement;
    authLink.addEventListener('click', (e) => {
      e.preventDefault();
      const authNav = document.querySelector(
        `[data-section="login"]`,
      ) as HTMLElement;
      if (authNav) {
        // goToPage(authNav);
      }
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

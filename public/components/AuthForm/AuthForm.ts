// import { goToPage } from '../..';
import { apiClient } from '../../modules/ApiClient';
import template from './AuthForm.hbs';

import {
  validateEmailAddress,
  validatePassword,
} from '../../modules/Validators';

export class AuthForm {
  #parent;

  constructor(parent: HTMLElement) {
    this.#parent = parent;
  }

  validatePasswordField(passwordValue: string): boolean {
    const passwordInput = document.getElementById(
      'form-auth-password',
    ) as HTMLElement;
    const passwordError = document.getElementById(
      'form-auth-password-error',
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

  validateEmailField(emailValue: string): boolean {
    const emailInput = document.getElementById(
      'form-auth-email',
    ) as HTMLElement;
    const emailError = document.getElementById(
      'form-auth-email-error',
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

  throwAuthError(authErrorMessage: string): void {
    const errorBlock = document.getElementById('auth-error') as HTMLElement;
    errorBlock.innerHTML = authErrorMessage;
    errorBlock.classList.add('visible');
  }

  removeAuthError(): void {
    const errorBlock = document.getElementById('auth-error') as HTMLElement;
    errorBlock.innerHTML = '';
    errorBlock.classList.remove('visible');
  }

  async authRequest(emailValue: string, passwordValue: string) {
    try {
      await apiClient.post({
        path: 'auth/login',
        body: { email: emailValue, password: passwordValue },
      });

      const filmsNav = document.querySelector(
        `[data-section="films"]`,
      ) as HTMLElement;

      if (filmsNav) {
        // goToPage(filmsNav);
      }
    } catch (e: any) {
      if (e.status === 404) {
        this.throwAuthError('Пользователь с таким e-mail не найден');
      } else {
        this.throwAuthError('Что-то пошло не так. Попробуйте позже');
      }
    }
  }

  onAuthButtonClick(): void {
    const authBtn = document.getElementById('form-auth-btn') as HTMLElement;
    authBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      this.removeAuthError();

      const emailValue = (<HTMLInputElement>(
        document.getElementById('form-auth-email')
      )).value;
      const passwordValue = (<HTMLInputElement>(
        document.getElementById('form-auth-password')
      )).value;

      const isEmailValid = this.validateEmailField(emailValue);
      const isPasswordValid = this.validatePasswordField(passwordValue);

      if (!isEmailValid || !isPasswordValid) {
        return;
      }

      this.authRequest(emailValue, passwordValue);
    });
  }

  handleRegLinkClick(): void {
    const regLink = document.getElementById(
      'form-auth-reg-link',
    ) as HTMLElement;
    regLink.addEventListener('click', (e) => {
      e.preventDefault();

      const regNav = document.querySelector(
        `[data-section="signup"]`,
      ) as HTMLElement;

      if (regNav) {
        // goToPage(regNav);
      }
    });
  }

  render() {
    this.renderTemplate();
    this.onAuthButtonClick();
    this.handleRegLinkClick();
  }

  renderTemplate() {
    this.#parent.innerHTML = template();
  }
}

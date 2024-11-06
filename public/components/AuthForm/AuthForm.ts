import template from './AuthForm.hbs';
import { Actions } from 'flux/Actions';

import {
  validateEmailAddress,
  validatePassword,
} from '../../modules/Validators';
import { router } from 'modules/Router';

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

  onAuthButtonClick(): void {
    const authBtn = document.getElementById('form-auth-btn') as HTMLElement;
    authBtn.addEventListener('click', async (e) => {
      e.preventDefault();

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

      Actions.auth({ email: emailValue, password: passwordValue });
    });
  }

  handleRegLinkClick(): void {
    const regLink = document.getElementById(
      'form-auth-reg-link',
    ) as HTMLElement;
    regLink.addEventListener('click', (e) => {
      e.preventDefault();

      router.go('/registration');
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

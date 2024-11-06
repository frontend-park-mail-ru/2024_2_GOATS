import template from './RegForm.hbs';
import { Actions } from 'flux/Actions';

import {
  validateEmailAddress,
  validatePassword,
  validateLogin,
} from '../../modules/Validators';
import { router } from 'modules/Router';
import {
  validatePasswordConfirmation,
  validatePasswordCreation,
} from 'modules/PasswordValidation';

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

    return validatePasswordCreation(
      passwordValue,
      passwordInput,
      passwordError,
    );
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

    return validatePasswordConfirmation(
      passwordValue,
      passwordConfirmValue,
      passwordConfirmInput,
      passwordConfirmError,
    );
  }

  onRegButtonClick() {
    const regBtn = document.getElementById('form-reg-btn') as HTMLElement;
    regBtn.addEventListener('click', async (e) => {
      e.preventDefault();

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

      Actions.register({
        email: emailValue,
        username: loginValue,
        password: passwordValue,
        passwordConfirmation: confirmValue,
      });
    });
  }

  handleAuthLinkClick() {
    const authLink = document.getElementById(
      'form-reg-auth-link',
    ) as HTMLElement;
    authLink.addEventListener('click', (e) => {
      e.preventDefault();
      router.go('/auth');
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

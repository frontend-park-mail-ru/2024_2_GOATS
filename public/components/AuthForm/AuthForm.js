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

  validatePasswordField(passwordValue) {
    const passwordInput = document.getElementById('form-auth-password');
    const passwordError = document.getElementById('form-auth-password-error');

    if (validatePassword(passwordValue)) {
      passwordInput.classList.add('input-error');
      passwordError.innerText = validatePassword(passwordValue);
      console.log(validatePassword(passwordValue));
      return false;
    } else {
      passwordInput.classList.remove('input-error');
      passwordError.innerText = '';
      return true;
    }
  }

  validateEmailField(emailValue) {
    const emailInput = document.getElementById('form-auth-email');
    const emailError = document.getElementById('form-auth-email-error');

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

  throwAuthError(authErrorMessage) {
    const errorBlock = document.getElementById('auth-error');
    errorBlock.innerHTML = authErrorMessage;
    errorBlock.classList.add('visible');
  }

  removeAuthError() {
    const errorBlock = document.getElementById('auth-error');
    errorBlock.innerHTML = '';
    errorBlock.classList.remove('visible');
  }

  async authRequest(emailValue, passwordValue) {
    try {
      const response = await apiClient.post({
        path: 'tasks',
        body: { email: emailValue, password: passwordValue },
      });
      // throw Error; // TODO: нужен бэк
    } catch {
      this.throwAuthError('Пользователь с таким e-mail не найден');
    }
  }

  onAuthButtonClick() {
    const authBtn = document.getElementById('form-auth-btn');
    authBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      this.removeAuthError();

      const emailValue = document.getElementById('form-auth-email').value;
      const passwordValue = document.getElementById('form-auth-password').value;

      const isEmailValid = this.validateEmailField(emailValue);
      const isPasswordValid = this.validatePasswordField(passwordValue);

      if (!isEmailValid || !isPasswordValid) {
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

  render() {
    this.renderTemplate();
    this.onAuthButtonClick();
    this.handleRegLinkClick();
  }

  renderTemplate() {
    const template = Handlebars.templates['AuthForm.hbs'];
    this.#parent.innerHTML = template();
  }
}

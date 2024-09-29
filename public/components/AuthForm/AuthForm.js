import { goToPage } from '../..';
import { apiClient } from '../../modules/ApiClient';
import template from './AuthForm.hbs';

import {
  validateEmailAddress,
  validatePassword,
} from '../../modules/Validators';

export class AuthForm {
  #parent;
  #config;

  constructor(parent) {
    this.#parent = parent;
  }

  get config() {
    return this.#config;
  }

  /**
   * Password value validation
   * @param {string} passwordValue - password value entered by user
   * @returns {boolean} - true if password value is valid
   */
  validatePasswordField(passwordValue) {
    const passwordInput = document.getElementById('form-auth-password');
    const passwordError = document.getElementById('form-auth-password-error');

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

  /**
   *  Email value validation
   * @param {string} emailValue - email value entered by user
   * @returns {boolean} - true if email value is valid
   */
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

  /**
   * Show error to user
   * @param {string} authErrorMessage - error message for showing to user
   * @returns {}
   */
  throwAuthError(authErrorMessage) {
    const errorBlock = document.getElementById('auth-error');
    errorBlock.innerHTML = authErrorMessage;
    errorBlock.classList.add('visible');
  }

  /**
   * Remove error from auth form
   * @param {}
   * @returns {}
   */
  removeAuthError() {
    const errorBlock = document.getElementById('auth-error');
    errorBlock.innerHTML = '';
    errorBlock.classList.remove('visible');
  }

  /**
   * Send auth request
   * @param {string} emailValue - email value entered by user
   * @param {string} passwordValue - password value entered by user
   * @returns {Promise<Object>} - response from the API
   */
  async authRequest(emailValue, passwordValue) {
    try {
      await apiClient.post({
        path: 'auth/login',
        body: { email: emailValue, password: passwordValue },
      });

      goToPage(document.querySelector(`[data-section="films"]`));
    } catch (e) {
      if (e.status === 404) {
        this.throwAuthError('Пользователь с таким e-mail не найден');
      } else {
        this.throwAuthError('Что-то пошло не так. Попробуйте позже');
      }
    }
  }

  /**
   * Processing of clicking on the authorization button
   * @param {}
   * @returns {}
   */
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

  /**
   * Navigate to registration
   * @param {}
   * @returns {}
   */
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
    this.#parent.innerHTML = template();
  }
}

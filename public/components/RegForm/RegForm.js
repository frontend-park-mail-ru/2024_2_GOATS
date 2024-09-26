import { goToPage } from '../..';
import { apiClient } from '../../modules/ApiClient';
import template from './RegForm.hbs';

import {
  validateEmailAddress,
  validatePassword,
  validateLogin,
} from '../../modules/Validators';

export class RegForm {
  #parent;
  #config;

  constructor(parent) {
    this.#parent = parent;
  }

  get config() {
    return this.#config;
  }

  /**
   * Registration fields validation
   * @param {string} loginValue - login value entered by user
   * @param {string} emailValue - email value entered by user
   * @param {string} passwordValue - password value entered by user
   * @param {string} passwordConfirmInput - password confirmation value entered by user
   * @returns {boolean} - true if the entered fields are valid
   */
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
        emailInput.classList.add('error');
      } else {
        emailInput.classList.remove('error');
      }

      if (!validateLogin(loginValue)) {
        loginInput.classList.add('error');
      } else {
        loginInput.classList.remove('error');
      }

      if (!validatePassword(passwordValue)) {
        passwordInput.classList.add('error');
      } else {
        passwordInput.classList.remove('error');
      }
      if (passwordValue != confirmValue) {
        passwordConfirmInput.classList.add('error');
      } else {
        passwordConfirmInput.classList.remove('error');
      }
      return false;
    } else {
      emailInput.classList.remove('error');
      loginInput.classList.remove('error');
      passwordInput.classList.remove('error');
      passwordConfirmInput.classList.remove('error');

      return true;
    }
  }

  /**
   * Send registration request
   * @param {string} loginValue - login value entered by user
   * @param {string} emailValue - email value entered by user
   * @param {string} passwordValue - password value entered by user
   * @param {string} passwordConfirmInput - password confirmation value entered by user
   * @returns {}
   */
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

  /**
   * Processing of clicking on the registration button
   * @param {}
   * @returns {}
   */
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

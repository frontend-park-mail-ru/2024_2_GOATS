import { goToPage } from '../..';
import { apiClient } from '../../modules/ApiClient';
import {
  validateEmailAddress,
  validatePassword,
} from '../../modules/Validators';
import { RegForm } from '../RegForm/RegForm';

export class AuthForm {
  #parent;
  #config;

  constructor(parent) {
    this.#parent = parent;
  }

  get config() {
    return this.#config;
  }

  // TODO: привести в порядок
  validateFormFields(emailValue, passwordValue) {
    const emailError = document.getElementById('form-auth-email-error');
    const passwordError = document.getElementById('form-auth-password-error');

    if (!validateEmailAddress(emailValue) || !validatePassword(passwordValue)) {
      if (!validateEmailAddress(emailValue)) {
        emailError.innerText = 'Некорректный e-mail';
      } else {
        emailError.innerText = '';
      }
      if (!validatePassword(passwordValue)) {
        passwordError.innerText = 'Пароль должен содержать минимум 8 символов';
      } else {
        passwordError.innerText = '';
      }
      return false;
    } else {
      emailError.innerText = '';
      passwordError.innerText = '';
      return true;
    }
  }

  onButtonClick() {
    const authBtn = document.getElementById('form-auth-btn');
    authBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const emailValue = document.getElementById('form-auth-email').value;
      const passwordValue = document.getElementById('form-auth-password').value;

      const emailError = document.getElementById('form-auth-email-error');
      const passwordError = document.getElementById('form-auth-password-error');

      if (!this.validateFormFields(emailValue, passwordValue)) {
        return;
      }

      apiClient.post({
        path: 'tasks',
        body: { email: emailValue, password: passwordValue },
        callback: (response) => {
          console.log('fetch', response);
        },
      });

      console.log('clicked!', emailValue, passwordValue);
    });
  }

  render() {
    this.renderTemplate();
    this.onButtonClick();
    this.goToRegistration();
  }

  renderTemplate() {
    const template = Handlebars.templates['AuthForm.hbs'];
    this.#parent.innerHTML = template();
  }

  goToRegistration() {
    // const regLink = document.getElementById('form-auth-reg-link');
    //   regLink.addEventListener('click', (e) => {
    //     e.preventDefault();
    //     this.#parent.innerHTML = '';
    //     const regForm = new RegForm(this.#parent);
    //     regForm.render();
    //   });

    const regLink = document.getElementById('form-auth-reg-link');
    regLink.addEventListener('click', (e) => {
      e.preventDefault();
      goToPage(document.querySelector(`[data-section="signup"]`));
    });
  }
}

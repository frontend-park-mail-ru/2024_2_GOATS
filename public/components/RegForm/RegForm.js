import { goToPage } from '../..';
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

  validateFormFields(loginValue, emailValue, passwordValue, confirmValue) {
    const emailError = document.getElementById('form-reg-email-error');
    const passwordError = document.getElementById('form-reg-password-error');
    const loginError = document.getElementById('form-reg-login-error');
    const confirmError = document.getElementById('form-reg-confirm-error');

    if (
      !validateEmailAddress(emailValue) ||
      !validatePassword(passwordValue) ||
      !validateLogin(loginValue)
    ) {
      if (!validateEmailAddress(emailValue)) {
        emailError.innerText = 'Некорректный e-mail';
        emailError.classList.add('visible');
      } else {
        emailError.innerText = '';
      }
      if (!validatePassword(passwordValue)) {
        passwordError.classList.add('visible');
        passwordError.innerText = 'Пароль должен содержать минимум 8 символов';
      } else {
        passwordError.innerText = '';
      }

      if (!validateLogin(loginValue)) {
        loginError.classList.add('visible');
        loginError.innerText = 'Минимум 6 символов – латиница, цифры и точка.';
      } else {
        loginError.innerText = '';
      }

      if (passwordValue != confirmValue) {
        confirmError.classList.add('visible');
        confirmError.innerText = 'Неверный пароль';
      } else {
        confirmError.innerText = '';
      }
      return false;
    } else {
      passwordError.classList.remove('visible');
      emailError.classList.remove('visible');
      loginError.classList.remove('visible');
      confirmError.classList.remove('visible');

      emailError.innerText = '';
      passwordError.innerText = '';
      loginError.innerText = '';
      confirmError.innerText = '';

      return true;
    }
  }

  onButtonClick() {
    const regBtn = document.getElementById('form-reg-btn');
    console.log(regBtn);
    regBtn.addEventListener('click', (e) => {
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

      console.log('clicked!', emailValue, passwordValue);
      const fetchData = async () => {
        const response = await fetch(
          'https://6681cdf504acc3545a079ff2.mockapi.io/tasks/',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: emailValue,
              password: passwordValue,
            }),
          },
        );

        if (!response.ok) {
          throw new Error('Auth error');
        }

        await response.json();
      };

      fetchData().catch((error) => {
        throw error;
      });
    });
  }

  render() {
    this.renderTemplate();
    this.onButtonClick();
    this.goToAuth();
  }

  renderTemplate() {
    const template = Handlebars.templates['RegForm.hbs'];
    this.#parent.innerHTML = template();
  }

  goToAuth() {
    // const authLink = document.getElementById('form-reg-auth-link');
    // authLink.addEventListener('click', (e) => {
    //   e.preventDefault();
    //   this.#parent.innerHTML = '';
    //   const authForm = new AuthForm(this.#parent);
    //   authForm.render();
    // });

    const authLink = document.getElementById('form-reg-auth-link');
    authLink.addEventListener('click', (e) => {
      e.preventDefault();
      goToPage(document.querySelector(`[data-section="login"]`));
    });
  }
}

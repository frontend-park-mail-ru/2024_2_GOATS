import { apiClient } from '../../modules/ApiClient';
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

  onButtonClick() {
    const authBtn = document.getElementById('form-auth-btn');
    authBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const emailValue = document.getElementById('form-auth-email').value;
      const passwordValue = document.getElementById('form-auth-password').value;

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
    const regLink = document.getElementById('form-auth-reg-link');
    regLink.addEventListener('click', (e) => {
      e.preventDefault();
      this.#parent.innerHTML = '';
      const regForm = new RegForm(this.#parent);
      regForm.render();
    });
  }
}

import { apiClient } from '../../modules/ApiClient';

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
  }

  renderTemplate() {
    const template = Handlebars.templates['AuthForm.hbs'];
    this.#parent.innerHTML = template();
  }
}

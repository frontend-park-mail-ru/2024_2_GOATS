import { AuthForm } from '../AuthForm/AuthForm';

export class RegForm {
  #parent;
  #config;

  constructor(parent) {
    this.#parent = parent;
  }

  get config() {
    return this.#config;
  }

  onButtonClick() {
    const regBtn = document.getElementById('form-reg-btn');
    console.log(regBtn);
    regBtn.addEventListener('click', (e) => {
      e.preventDefault();

      const emailValue = document.getElementById('form-reg-email').value;
      const passwordValue = document.getElementById('form-reg-password').value;
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
          }
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
    const authLink = document.getElementById('form-reg-auth-link');
    authLink.addEventListener('click', (e) => {
      e.preventDefault();
      this.#parent.innerHTML = '';
      const authForm = new AuthForm(this.#parent);
      authForm.render();
    });
  }
}

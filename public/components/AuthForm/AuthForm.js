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
    const authBtn = document.getElementById('form__auth-btn');
    authBtn.addEventListener('click', () => {
      const emailValue = document.getElementById('form-auth-email').value;
      const passwordValue = document.getElementById('form-auth-password').value;
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
  }

  renderTemplate() {
    const template = Handlebars.templates['AuthForm.hbs'];
    this.#parent.innerHTML = template();
  }
}

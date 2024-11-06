import { router } from 'modules/Router';
import template from './ErrorPage.hbs';

export class ErrorPage {
  #errorTitle: string;
  #errorDescription: string;

  constructor(props: { errorTitle: string; errorDescription: string }) {
    this.#errorTitle = props.errorTitle;
    this.#errorDescription = props.errorDescription;
  }

  handleExitClick() {
    const toMainButton = document.getElementById(
      'from-error-to-main-button',
    ) as HTMLButtonElement;
    toMainButton.addEventListener('click', () => {
      router.go('/');
    });
  }

  render() {
    this.renderTemplate();
  }

  renderTemplate() {
    const pageElement = document.getElementsByTagName('main')[0];
    pageElement.innerHTML = template({
      title: this.#errorTitle,
      description: this.#errorDescription,
    });
    this.handleExitClick();
  }
}

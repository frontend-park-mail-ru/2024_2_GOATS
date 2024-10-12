import { ActionTypes } from 'flux/ActionTypes';
import { dispatcher } from 'flux/Dispatcher';
import { AuthPage } from './AuthPage';
import { apiClient } from 'modules/ApiClient';
import { Actions } from 'flux/Actions';

class AuthPageStore {
  constructor() {
    dispatcher.register(this.reduce.bind(this));
  }

  renderAuth() {
    // Actions.renderHeader();
    const authPage = new AuthPage();
    authPage.render();
  }

  throwAuthError(authErrorMessage: string): void {
    const errorBlock = document.getElementById('auth-error') as HTMLElement;
    errorBlock.innerHTML = authErrorMessage;
    errorBlock.classList.add('visible');
  }

  removeAuthError(): void {
    const errorBlock = document.getElementById('auth-error') as HTMLElement;
    errorBlock.innerHTML = '';
    errorBlock.classList.remove('visible');
  }

  async authRequest(emailValue: string, passwordValue: string) {
    try {
      this.removeAuthError();
      await apiClient.post({
        path: 'auth/login',
        body: { email: emailValue, password: passwordValue },
      });

      const filmsNav = document.querySelector(
        `[data-section="films"]`,
      ) as HTMLElement;

      if (filmsNav) {
        // goToPage(filmsNav);
      }
    } catch (e: any) {
      if (e.status === 404) {
        this.throwAuthError('Пользователь с таким e-mail не найден');
      } else {
        this.throwAuthError('Что-то пошло не так. Попробуйте позже');
      }
    }
  }

  reduce(action: any) {
    switch (action.type) {
      case ActionTypes.RENDER_AUTH_PAGE:
        this.renderAuth();
        break;
      case ActionTypes.AUTH:
        this.authRequest(action.authData.email, action.authData.password);
        break;
      default:
        break;
    }
  }
}

export const authPageStore = new AuthPageStore();

import { ActionTypes } from 'flux/ActionTypes';
import { dispatcher } from 'flux/Dispatcher';
import { RegPage } from 'pages/RegPage/RegPage';
import { apiClient } from 'modules/ApiClient';
import { router } from 'modules/Router';
import { userStore } from 'store/UserStore';

class RegPageStore {
  constructor() {
    dispatcher.register(this.reduce.bind(this));
  }

  renderReg() {
    const regPage = new RegPage();
    regPage.render();
  }

  throwRegError(authErrorMessage: string) {
    const errorBlock = document.getElementById('reg-error') as HTMLElement;
    errorBlock.innerHTML = authErrorMessage;
    errorBlock.classList.add('visible');
  }

  removeRegError() {
    const errorBlock = document.getElementById('reg-error') as HTMLElement;
    errorBlock.innerHTML = '';
    errorBlock.classList.remove('visible');
  }

  async regRequest(
    emailValue: string,
    loginValue: string,
    passwordValue: string,
    confirmValue: string,
  ) {
    try {
      this.removeRegError();
      await apiClient.post({
        path: 'auth/signup',
        body: {
          email: emailValue,
          username: loginValue,
          password: passwordValue,
          passwordConfirmation: confirmValue,
        },
      });

      userStore.checkAuth(true);
      router.go('/');
    } catch (e: any) {
      if (e.status === 409) {
        this.throwRegError('Такой пользователь уже существует');
      } else {
        this.throwRegError('Что-то пошло не так. Попробуйте позже');
      }
    }
  }

  reduce(action: any) {
    switch (action.type) {
      case ActionTypes.RENDER_REG_PAGE:
        this.renderReg();
        break;
      case ActionTypes.REGISTER:
        this.regRequest(
          action.registrationData.email,
          action.registrationData.username,
          action.registrationData.password,
          action.registrationData.passwordConfirmation,
        );
        break;
      default:
        break;
    }
  }
}

export const regPageStore = new RegPageStore();

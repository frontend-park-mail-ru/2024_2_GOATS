import { ActionTypes } from 'flux/ActionTypes';
import { dispatcher } from 'flux/Dispatcher';
import { RegPage } from 'pages/RegPage/RegPage';
import { apiClient } from 'modules/ApiClient';
import { router } from 'modules/Router';
import { userStore } from 'store/UserStore';
import { throwBackendError, removeBackendError } from 'modules/BackendErrors';

class RegPageStore {
  constructor() {
    dispatcher.register(this.reduce.bind(this));
  }

  renderReg() {
    const regPage = new RegPage();
    regPage.render();
  }

  async regRequest(
    emailValue: string,
    loginValue: string,
    passwordValue: string,
    confirmValue: string,
  ) {
    try {
      removeBackendError('reg');
      await apiClient.post({
        path: 'auth/signup',
        body: {
          email: emailValue,
          username: loginValue,
          password: passwordValue,
          passwordConfirmation: confirmValue,
        },
      });

      userStore.checkAuth();
      router.go('/');
    } catch (e: any) {
      if (e.status === 409) {
        throwBackendError('reg', 'Такой пользователь уже существует');
      } else {
        throwBackendError('reg', 'Что-то пошло не так. Попробуйте позже');
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

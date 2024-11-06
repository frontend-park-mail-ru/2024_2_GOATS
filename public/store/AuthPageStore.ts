import { ActionTypes } from 'flux/ActionTypes';
import { dispatcher } from 'flux/Dispatcher';
import { AuthPage } from 'pages/AuthPage/AuthPage';
import { apiClient } from 'modules/ApiClient';
import { router } from 'modules/Router';
import { userStore } from 'store/UserStore';
import { throwBackendError, removeBackendError } from 'modules/BackendErrors';
import { User } from 'types/user';

class AuthPageStore {
  constructor() {
    dispatcher.register(this.reduce.bind(this));

    const userLoadingListener = userStore.isUserLoadingEmmiter$.addListener(
      () => {
        if (router.getCurrentPath() === '/auth') {
          this.renderAuth();
        }
      },
    );

    this.ngOnDestroy = () => {
      userLoadingListener();
    };
  }
  ngOnDestroy(): void {}

  renderAuth() {
    if (userStore.getisUserLoading()) {
      return;
    } else {
      if (!userStore.getUserAuthStatus()) {
        const authPage = new AuthPage();
        authPage.render();
      } else {
        router.go('/');
      }
    }
  }

  async authRequest(emailValue: string, passwordValue: string) {
    try {
      removeBackendError('auth');
      await apiClient.post({
        path: 'auth/login',
        body: { email: emailValue, password: passwordValue },
      });

      userStore.checkAuth();
      router.go('/');
    } catch (e: any) {
      // TODO: поменять обработку статус
      if (e.status === 404 || e.status === 409) {
        throwBackendError('auth', 'Неверный e-mail или пароль');
      } else {
        throwBackendError('auth', 'Что-то пошло не так. Попробуйте позже');
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

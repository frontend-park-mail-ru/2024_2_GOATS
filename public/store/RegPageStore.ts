import { ActionTypes } from 'flux/ActionTypes';
import { dispatcher } from 'flux/Dispatcher';
import { RegPage } from 'pages/RegPage/RegPage';
import { apiClient } from 'modules/ApiClient';
import { router } from 'modules/Router';
import { userStore } from 'store/UserStore';
import { throwBackendError, removeBackendError } from 'modules/BackendErrors';
import { roomPageStore } from './RoomPageStore';

class RegPageStore {
  constructor() {
    dispatcher.register(this.reduce.bind(this));

    const userLoadingListener = userStore.isUserLoadingEmmiter$.addListener(
      () => {
        if (router.getCurrentPath() === '/registration') {
          this.renderReg();
        }
      },
    );

    const userAuthListener = userStore.isUserAuthEmmiter$.addListener(() => {
      if (router.getCurrentPath() === '/registration') {
        if (roomPageStore.getGlobalRoomId() && userStore.getUser().username) {
          roomPageStore.setIsModalConfirm(false);
          router.go('/room', roomPageStore.getGlobalRoomId());
        }
      }
    });

    this.ngOnDestroy = () => {
      userLoadingListener();
    };

    this.ngOnUserAuthDestroy = () => {
      userAuthListener();
    };
  }
  ngOnDestroy(): void {}
  ngOnUserAuthDestroy(): void {}

  renderReg() {
    if (userStore.getisUserLoading()) {
      return;
    } else {
      if (!userStore.getUserAuthStatus()) {
        const regPage = new RegPage();
        regPage.render();
      } else if (!roomPageStore.getGlobalRoomId()) {
        router.go('/');
      }
    }
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
      if (!roomPageStore.getGlobalRoomId()) {
        router.go('/');
      }
    } catch (e: any) {
      if (e.status === 422) {
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

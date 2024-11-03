import { ProfilePage } from 'pages/ProfilePage/ProfilePage';
import { ActionTypes } from 'flux/ActionTypes';
import { User, UserData } from 'types/user';
import { dispatcher } from 'flux/Dispatcher';
import { apiClient } from 'modules/ApiClient';
import { Emitter } from 'modules/Emmiter';
import { removeBackendError, throwBackendError } from 'modules/BackendErrors';
import { Notifier } from 'components/Notifier/Notifier';
import { router } from 'modules/Router';
import { userStore } from './UserStore';
import { Actions } from 'flux/Actions';

// let mockUser = {
//   email: 'tkoibaev@mail.ru',
//   username: 'tkoibaev',
//   name: '',
//   avatar: '', //  assets/mockImages/user-profile_image.png
// };

export class ProfilePageStore {
  #user!: User;
  #passwordChangedEmitter: Emitter<boolean>;

  constructor() {
    this.#passwordChangedEmitter = new Emitter<boolean>(false);
    dispatcher.register(this.reduce.bind(this));

    // const userListener = userStore.isUserAuthEmmiter$.addListener((status) => {
    //   if (status && router.getCurrentPath() === '/profile') {
    //     this.renderProfilePage();
    //   }
    // });

    const userLoadingListener = userStore.isUserLoadingEmmiter$.addListener(
      () => {
        if (router.getCurrentPath() === '/profile') {
          this.renderProfilePage();
        }
      },
    );

    this.ngOnDestroy = () => {
      // userListener();
      userLoadingListener();
    };
  }
  ngOnDestroy(): void {}

  get passwordChangedEmitter$(): Emitter<boolean> {
    return this.#passwordChangedEmitter;
  }

  renderProfilePage() {
    if (userStore.getisUserLoading()) {
      return;
    } else {
      if (userStore.getUserAuthStatus()) {
        this.#user = userStore.getUser();
        const profilePage = new ProfilePage();
        profilePage.render();
      } else {
        router.go('/');
      }
    }
  }

  getUserInfo() {
    return this.#user;
  }

  async changePasswordRequest(
    prevPasswordValue: string,
    newPasswordValue: string,
    confirmPasswordValue: string,
  ) {
    this.#passwordChangedEmitter.set(false);
    try {
      const response = await apiClient.post({
        path: `users/${this.#user.id}/update_password`,
        body: {
          oldPassword: prevPasswordValue,
          password: newPasswordValue,
          passwordConfirmation: confirmPasswordValue,
        },
      });
      this.#passwordChangedEmitter.set(true);
    } catch {
      throwBackendError('change-password', 'Неверно указан старый пароль');
    }
  }

  async logout() {
    try {
      await apiClient.post({
        path: 'auth/logout',
        body: {},
      });
      router.go('/');
    } catch {
      userStore.checkAuth();
      throw new Error('logout error');
    } finally {
      userStore.checkAuth();
    }
  }

  async changeUserInfoRequest(userData: UserData) {
    try {
      removeBackendError('update-profile');
      const formData = new FormData();
      this.#user.username !== userData.username
        ? formData.append('username', userData.username)
        : formData.append('username', '');

      this.#user.email !== userData.email
        ? formData.append('email', userData.email)
        : formData.append('email', '');
      formData.append('avatar', userData.avatar);
      const response = await apiClient.post({
        path: `users/${this.#user.id}/update_profile`,
        formData: formData,
      });
      const not = new Notifier('success', 'Данные успешно обновлены', 2000);
      not.render();
      userStore.checkAuth();
    } catch {
      throw throwBackendError(
        'update-profile',
        'Уже существует аккаунт с таким логином или почтой',
      );
      // const not = new Notifier(
      //   'error',
      //   'Уже существует аккаунт с таким логином или почтой',
      //   2000,
      // );
      // not.render();
    }
  }

  async reduce(action: any) {
    switch (action.type) {
      case ActionTypes.RENDER_PROFILE_PAGE:
        // this.getUserInfoRequest();
        this.renderProfilePage();

        break;
      case ActionTypes.CHANGE_PASSWORD:
        await this.changePasswordRequest(
          action.passwordChangeData.prevPasswordValue,
          action.passwordChangeData.newPasswordValue,
          action.passwordChangeData.newPasswordComfirmValue,
        );
        break;
      case ActionTypes.CHANGE_USER_INFO:
        await this.changeUserInfoRequest(action.userData);
        break;
      default:
        break;
    }
  }
}

export const profilePageStore = new ProfilePageStore();

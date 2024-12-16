import { ProfilePage } from 'pages/ProfilePage/ProfilePage';
import { ActionTypes } from 'flux/ActionTypes';
import { Subscription, User, UserData } from 'types/user';
import { dispatcher } from 'flux/Dispatcher';
import { apiClient } from 'modules/ApiClient';
import { Emitter } from 'modules/Emmiter';
import { removeBackendError, throwBackendError } from 'modules/BackendErrors';
import { Notifier } from 'components/Notifier/Notifier';
import { router } from 'modules/Router';
import { userStore } from './UserStore';

export class ProfilePageStore {
  #user!: User;
  #passwordChangedEmitter: Emitter<boolean>;
  #subscriptionFormLabel!: string;

  constructor() {
    this.#passwordChangedEmitter = new Emitter<boolean>(false);
    dispatcher.register(this.reduce.bind(this));

    const userLoadingListener = userStore.isUserLoadingEmmiter$.addListener(
      () => {
        if (router.getCurrentPath() === '/profile') {
          this.renderProfilePage();
        }
      },
    );

    this.ngOnDestroy = () => {
      userLoadingListener();
    };

    this.#subscriptionFormLabel = '';
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
      const response = await apiClient.put({
        path: `users/${this.#user.id}/password`,
        body: {
          oldPassword: prevPasswordValue,
          password: newPasswordValue,
          passwordConfirmation: confirmPasswordValue,
        },
      });
      this.#passwordChangedEmitter.set(true);
      const not = new Notifier('success', 'Пароль успешно изменен', 2000);
      not.render();
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
      const response = await apiClient.put({
        path: `users/${this.#user.id}/profile`,
        formData: formData,
      });
      const not = new Notifier('success', 'Данные успешно обновлены', 2000);
      not.render();
      userStore.checkAuth();
    } catch (e: any) {
      if (e.status === 409) {
        throw throwBackendError(
          'update-profile',
          'Уже существует аккаунт с таким логином или почтой',
        );
      } else {
        throwBackendError('auth', 'Что-то пошло не так. Попробуйте позже');
      }
    }
  }

  async sendPayment() {
    try {
      const response = await apiClient.post({
        path: 'subscription/',
        body: { amount: 2 },
      });

      this.#subscriptionFormLabel = response.subscription_idp;
    } catch {
      throw new Error('subscription error');
    }
  }

  async buySubscription(subscriptionFields: Subscription) {
    await this.sendPayment();
    subscriptionFields.subscriptionFormLabel.value =
      this.#subscriptionFormLabel;
    subscriptionFields.subscriptionForm.submit();
  }

  async reduce(action: any) {
    switch (action.type) {
      case ActionTypes.RENDER_PROFILE_PAGE:
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
        if (
          this.#user.username !== action.userData.username ||
          this.#user.email !== action.userData.email ||
          action.userData.avatar
        ) {
          await this.changeUserInfoRequest(action.userData);
        }
        break;
      case ActionTypes.BUY_SUBSCRIPTION:
        await this.buySubscription(action.subscriptionFields);
        break;
      default:
        break;
    }
  }
}

export const profilePageStore = new ProfilePageStore();

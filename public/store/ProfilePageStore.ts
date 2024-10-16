import { ProfilePage } from 'pages/ProfilePage/ProfilePage';
import { ActionTypes } from 'flux/ActionTypes';
import { User, UserData } from 'types/user';
import { dispatcher } from 'flux/Dispatcher';
import { apiClient } from 'modules/ApiClient';
import { Emitter } from 'modules/Emmiter';
import { throwBackendError } from 'modules/BackendErrors';

const mockUser = {
  email: 'tkoibaev@mail.ru',
  username: 'tkoibaev',
  name: '',
  avatar: '', //assets/mockImages/user-profile_image.png
};

export class ProfilePageStore {
  #user!: UserData;
  #passwordChangedEmitter: Emitter<boolean>;

  constructor() {
    this.#passwordChangedEmitter = new Emitter<boolean>(false);
    dispatcher.register(this.reduce.bind(this));
  }

  getUserInfoRequest() {
    this.#user = mockUser;
  }

  get passwordChangedEmitter$(): Emitter<boolean> {
    return this.#passwordChangedEmitter;
  }

  renderProfilePage() {
    const profilePage = new ProfilePage();
    profilePage.render();
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
      const response = await apiClient.get({
        path: 'movie_collections/',
      });
      this.#passwordChangedEmitter.set(true);
      alert({ prevPasswordValue, newPasswordValue, confirmPasswordValue });
    } catch {
      throwBackendError('change-password', 'Неверно указан старый пароль');
    }
  }

  async changeUserInfoRequest(userData: UserData) {
    try {
      // const response = await apiClient.get({
      //   path: 'movie_collection/',
      // });
      alert(userData);
      console.log(userData);
    } catch {
      alert('error');
    }
  }

  async reduce(action: any) {
    switch (action.type) {
      case ActionTypes.RENDER_PROFILE_PAGE:
        await this.getUserInfoRequest();
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

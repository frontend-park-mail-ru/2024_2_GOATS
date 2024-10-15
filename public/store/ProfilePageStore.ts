import { ProfilePage } from 'pages/ProfilePage/ProfilePage';
import { ActionTypes } from 'flux/ActionTypes';
import { User } from 'types/user';
import { dispatcher } from 'flux/Dispatcher';

const mockUser = {
  email: 'tkoibaev@mail.ru',
  username: 'tkoibaev',
  isAuth: true,
};

export class ProfilePageStore {
  #user!: User;

  constructor() {
    dispatcher.register(this.reduce.bind(this));
  }

  getUserInfoRequest() {
    this.#user = mockUser;
  }

  renderProfilePage() {
    const profilePage = new ProfilePage();
    profilePage.render();
  }

  getUserInfo() {
    return this.#user;
  }

  async reduce(action: any) {
    switch (action.type) {
      case ActionTypes.RENDER_PROFILE_PAGE:
        await this.getUserInfoRequest();
        this.renderProfilePage();
        // mainPage.render();
        // await this.getCollection();
        break;
      default:
        break;
    }
  }
}

export const profilePageStore = new ProfilePageStore();

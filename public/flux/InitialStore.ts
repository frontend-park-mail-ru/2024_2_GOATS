import { dispatcher } from './Dispatcher';
import { ActionTypes } from './ActionTypes';
import { apiClient } from 'modules/ApiClient';
import { Actions } from './Actions';
import { MainPage } from 'pages/MainPage/MainPage';
import { userStore } from './UserStore';
import { headerStore } from 'components/Header/HeaderStore';

const mainPage = new MainPage();

class InitialStore {
  constructor() {
    dispatcher.register(this.reduce.bind(this));
  }

  reduce(action: any) {
    switch (action.type) {
      case ActionTypes.RENDER_MAIN_PAGE:
        mainPage.render();
        break;

      default:
        break;
    }
  }

  async start() {
    await Actions.getUser();
    // const user = userStore.getUser();
    // console.log(user);

    // try {
    //   if (!userIn.isAuth) {
    //     const response = await apiClient.get({ path: 'auth/session' });
    //     if (response.user_data.email) {
    //       console.log(response.user_data);
    //     }
    //   }
    // } catch (err) {
    //   console.log(err);
    // }
    // Actions.renderHeader(user);
  }
}

export const initialStore = new InitialStore();

import { dispatcher } from './Dispatcher';
import { ActionTypes } from './ActionTypes';
import { apiClient } from 'modules/ApiClient';
import { Actions } from './Actions';
import { MainPage } from 'pages/MainPage/MainPage';
import { userStore } from './UserStore';
import { headerStore } from 'components/Header/HeaderStore';

// const root = document.getElementById('root') as HTMLElement;
// const pageElement = document.createElement('main');
// pageElement.id = 'page-element';
// root.appendChild(pageElement);
// // const pageElement = document.getElementsByTagName('main')[0];
// console.log(pageElement);
const test = document.getElementById('fff');
console.log(test);
// const mainPage = new MainPage(pageElement);

class InitialStore {
  constructor() {
    console.log('start');
    dispatcher.register(this.reduce.bind(this));
  }

  reduce(action: any) {
    switch (action.type) {
      case ActionTypes.RENDER_MAIN_PAGE:
        // mainPage.render();
        break;

      default:
        break;
    }
  }

  async start() {
    const user = userStore.getUser();
    const head = headerStore.renderHeader(user);
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
    // console.log(user);
    Actions.getUser();
    Actions.renderHeader(user);
  }
}

export const initialStore = new InitialStore();

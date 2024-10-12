import { Actions } from './Actions';
import { userStore } from './UserStore';

class InitialStore {
  constructor() {}

  async start() {
    Actions.getUser();
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

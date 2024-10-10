import { Actions } from './Actions';
import { userStore } from './UserStore';

class InitialStore {
  constructor() {}

  async start() {
    const user = userStore.getUser();
    Actions.getUser();
    Actions.renderHeader(user);
  }
}

export const initialStore = new InitialStore();

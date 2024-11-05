import { Actions } from 'flux/Actions';
import { userStore } from './UserStore';

class InitialStore {
  constructor() {}

  async start() {
    // Actions.getCsrf();
    Actions.getUser();
  }
}

export const initialStore = new InitialStore();

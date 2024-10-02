import { UserInfo } from './user';

export type PagesConfig = {
  currentUser: UserInfo;
  renderMainPage: () => void;
  renderAuthPage: () => void;
  renderRegPage: () => void;
};

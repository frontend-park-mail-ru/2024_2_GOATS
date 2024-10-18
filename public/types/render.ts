import { User } from './user';

export type PagesConfig = {
  currentUser: User;
  renderMainPage: () => void;
  renderAuthPage: () => void;
  renderRegPage: () => void;
};

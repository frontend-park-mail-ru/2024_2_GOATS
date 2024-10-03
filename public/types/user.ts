export type AuthUser = {
  email: string;
  username?: string;
  password: string;
  passwordConfirmation?: string;
};

export type UserInfo = {
  email: string;
  username: string;
};

export type AuthUser = {
  email: string;
  username?: string;
  password: string;
  passwordConfirmation?: string;
};

export type User = {
  email?: string;
  username?: string;
};

export type UserInfo = {
  email: string;
  username: string;
};

export type AuthUser = {
  email: string;
  username?: string;
  password: string;
  passwordConfirmation?: string;
};

export type User = {
  email: string;
  username: string;
  name?: string;
  birthDate?: Date;
  avatar?: string;
  isAuth: boolean;
};

export type UserData = {
  email: string;
  username: string;
  name: string;
  avatar: string;
};

// export type UserInfo = {
//   email: string;
//   username: string;

// };

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

// TODO: Прогнать через сериализатор
export type UserNew = {
  id: number;
  email: string;
  username: string;
  birthdate?: string; // TODO: переделать в Date
  sex?: string; // TODO: перепроверить
  avatar_url?: string;
  isAdmin?: boolean;
};

// export type UserInfo = {
//   email: string;
//   username: string;

// };

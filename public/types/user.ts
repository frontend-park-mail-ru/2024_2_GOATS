export type AuthUser = {
  email: string;
  username?: string;
  password: string;
  passwordConfirmation?: string;
};

export type User = {
  id: number;
  email: string;
  username: string;
  birthDate?: Date;
  avatar: string;
  // isAuth: boolean;
};

// For profile editing
export type UserData = {
  email: string;
  username: string;
  avatar: File;
};

// TODO: Прогнать через сериализатор
export type UserNew = {
  id: number;
  email: string;
  username: string;
  birthdate?: string; // TODO: переделать в Date
  sex?: string; // TODO: перепроверить
  avatar?: string;
  isAdmin?: boolean;
};

// export type UserInfo = {
//   email: string;
//   username: string;

// };

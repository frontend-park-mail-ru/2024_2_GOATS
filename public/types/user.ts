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
  isPremium: boolean;
};

// For profile editing
export type UserData = {
  email: string;
  username: string;
  avatar: File;
};

export type UserNew = {
  id: number;
  email: string;
  username: string;
  birthdate?: string;
  sex?: string;
  avatar?: string;
  isAdmin?: boolean;
};

export type Subscription = {
  subscriptionForm: HTMLFormElement;
  subscriptionFormLabel: HTMLInputElement;
};

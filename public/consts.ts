import { User } from 'types/user';

export const PREV_HOST = 'http://185.241.195.151/';
export const HOST = 'https://cassette-world.ru/';
export const API_URL = HOST + 'api/';
// export const API_URL = 'http://localhost:8080/api/';
// export const API_URL = 'http://192.168.2.1:8080/api/';

export const GRID_MOVIES_AMOUNT = 3;

export const CHAR_A_CODE = 65;
export const CHAR_Z_CODE = 90;
export const CHAR_a_CODE = 97;
export const CHAR_z_CODE = 122;
export const CHAR_0_CODE = 48;
export const CHAR_9_CODE = 57;

export const allowedTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'image/avif',
];

type ValidationInfo = {
  pass: boolean;
  errorMessage: string;
};

type PasswordValidationRules = {
  rules: {
    minLength: ValidationInfo;
    hasDigit: ValidationInfo;
  };

  reset: () => PasswordValidationRules;
};

export const passwordValidationRules: PasswordValidationRules = {
  rules: {
    minLength: {
      pass: false,
      errorMessage: 'Пароль должен содержать минимум 8 символов',
    },
    hasDigit: {
      pass: false,
      errorMessage: 'Пароль должен содержать хотя бы одну цифру',
    },
  },

  reset() {
    const fields = Object.values(this.rules) as ValidationInfo[];
    fields.forEach((field) => {
      field.pass = false;
    });
    return this;
  },
};

type LoginValidationRules = {
  rules: {
    minLength: ValidationInfo;
    maxLength: ValidationInfo;
    hasNoSpec: ValidationInfo;
  };
  reset: () => LoginValidationRules;
};

type AvatarValidationRules = {
  rules: {
    maxSize: ValidationInfo;
    invalidType: ValidationInfo;
  };
  reset: () => AvatarValidationRules;
};

export const loginValidationRules: LoginValidationRules = {
  rules: {
    minLength: {
      pass: false,
      errorMessage: 'Логин должен содержать минимум 6 символов',
    },

    maxLength: {
      pass: false,
      errorMessage: 'Логин должен содержать максимум 24 символов',
    },

    hasNoSpec: {
      pass: false,
      errorMessage: 'Разрешены символы латинского алфавита, цифры и "."',
    },
  },

  reset() {
    const fields = Object.values(this.rules) as ValidationInfo[];
    fields.forEach((field) => {
      field.pass = false;
    });
    return this;
  },
};

export const avatarValidationRules: AvatarValidationRules = {
  rules: {
    maxSize: {
      pass: false,
      errorMessage: 'Максималный размер файла - 1 МБ',
    },

    invalidType: {
      pass: false,
      errorMessage: 'Неверный формат файла',
    },
  },

  reset() {
    const fields = Object.values(this.rules) as ValidationInfo[];
    fields.forEach((field) => {
      field.pass = false;
    });
    return this;
  },
};

export function setPagesConfig(
  user: User | undefined,
  renderMainPage: () => void,
  renderAuthPage: () => void,
  renderRegPage: () => void,
) {
  return {
    pages: {
      films: {
        text: 'Подборка фильмов',
        href: '/main',
        id: 'main-page-nav',
        render: renderMainPage,
        isAvailable: true,
      },
      login: {
        text: 'Авторизация',
        href: '/auth',
        id: 'login-page-nav',
        render: renderAuthPage,
        isAvailable: !user?.username,
      },
      signup: {
        text: 'Регистрация',
        href: '/register',
        id: 'signup-page-nav',

        render: renderRegPage,
        isAvailable: !user?.username,
      },
    },
  };
}

export const monthDictionary = new Map([
  ['01', 'Января'],
  ['02', 'Февраля'],
  ['03', 'Марта'],
  ['04', 'Апреля'],
  ['05', 'Мая'],
  ['06', 'Июня'],
  ['07', 'Июля'],
  ['08', 'Августа'],
  ['09', 'Сентября'],
  ['10', 'Октября'],
  ['11', 'Ноября'],
  ['12', 'Декабря'],
]);

export const setFocusTimeout = (item: HTMLElement, timeout: number) => {
  setTimeout(() => {
    item.focus();
  }, timeout);
};

export const CARD_PREVIEW_EXPANDING_TIMEOUT = 400;
export const CARD_PREVIEW_HIDING_TIMEOUT = 300;
export const PLAYER_CONTROLL_HIDING_TIMEOUT = 3000;
export const NOTIFIER_WRAPPER_CLEAN_TIMEOUT = 300;
export const CLOSING_SERIES_MENU_TIMEOUT = 300;

export const DEVICES_LIST = [
  'iPad Simulator',
  'iPhone Simulator',
  'iPod Simulator',
  'iPad',
  'iPhone',
  'iPod',
];

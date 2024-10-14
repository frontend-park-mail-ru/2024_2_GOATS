import { AuthUser, User } from 'types/user';

export const API_URL = 'http://185.241.195.151/api/';

export const movies = [
  {
    id: 1,
    title: 'Movie 1',
    src: 'https://img.utorrentfilmi.fun/uploads/posts/2024-06/1719383380_i5rnp.jpg',
    rating: 7.6,
  },
  {
    id: 2,
    title: 'Movie 2',
    src: 'https://megaobzor.com/uploads/old/load/stati/myfilm1.jpg',
    rating: 8.5,
  },
  {
    id: 3,
    title: 'Movie 3',
    src: 'https://img.freepik.com/premium-vector/retro-design-cinema-week-invitation-poster-with-popcorn-tickets-clapper-reels-realistic-vertical-vector-illustration_1284-77075.jpg',
    rating: 3.2,
  },
  {
    id: 4,
    title: 'Movie 4',
    src: 'https://img.utorrentfilmi.fun/uploads/posts/2024-08/1723484924_jk3s9.jpg',
    rating: 9.1,
  },
  {
    id: 5,
    title: 'Movie 5',
    src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5fCU-_5jLdMKFex1KPrxBMxlGFt_BSlUtwQ&s',
    rating: 10.0,
  },
  {
    id: 6,
    title: 'Movie 6',
    src: 'https://s3.afisha.ru/mediastorage/2a/33/d281002d901a4f7d84337489332a.jpg',
    rating: 6.6,
  },
];

export const CHAR_A_CODE = 65;
export const CHAR_Z_CODE = 90;
export const CHAR_a_CODE = 97;
export const CHAR_z_CODE = 122;
export const CHAR_0_CODE = 48;
export const CHAR_9_CODE = 57;

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

export const mockSeries = [
  {
    id: 1,
    position: 1,
    title: 'Серия 1',
    image:
      'https://deadline.com/wp-content/uploads/2021/09/The-Many-Saints-Of-Newark.jpg',
  },
  {
    id: 2,
    position: 2,
    title: 'Серия 2',
    image:
      'https://deadline.com/wp-content/uploads/2021/09/The-Many-Saints-Of-Newark.jpg',
  },
  {
    id: 3,
    position: 3,
    title: 'Серия 3',
    image:
      'https://deadline.com/wp-content/uploads/2021/09/The-Many-Saints-Of-Newark.jpg',
  },
  {
    id: 4,
    position: 4,
    title: 'Серия 4',
    image:
      'https://deadline.com/wp-content/uploads/2021/09/The-Many-Saints-Of-Newark.jpg',
  },
  {
    id: 5,
    position: 5,
    title: 'Серия 5',
    image:
      'https://deadline.com/wp-content/uploads/2021/09/The-Many-Saints-Of-Newark.jpg',
  },
];

export const mockPersons = [
  {
    id: 1,
    name: 'Джеймс Гандольфини',
    image:
      'https://avatars.mds.yandex.net/i?id=30e86f4fc42a7fc3062ee3c7124ac470_l-12510741-images-thumbs&n=13',
    isDirector: true,
  },
  {
    id: 2,
    name: 'Джеймс Гандольфини',
    image:
      'https://avatars.mds.yandex.net/i?id=30e86f4fc42a7fc3062ee3c7124ac470_l-12510741-images-thumbs&n=13',
    isDirector: true,
  },
  {
    id: 3,
    name: 'Джеймс Гандольфини',
    image:
      'https://avatars.mds.yandex.net/i?id=30e86f4fc42a7fc3062ee3c7124ac470_l-12510741-images-thumbs&n=13',
    isDirector: false,
  },
  {
    id: 4,
    name: 'Джеймс Гандольфини',
    image:
      'https://avatars.mds.yandex.net/i?id=30e86f4fc42a7fc3062ee3c7124ac470_l-12510741-images-thumbs&n=13',
    isDirector: false,
  },
  {
    id: 5,
    name: 'Джеймс Гандольфини',
    image:
      'https://avatars.mds.yandex.net/i?id=30e86f4fc42a7fc3062ee3c7124ac470_l-12510741-images-thumbs&n=13',
    isDirector: false,
  },
  {
    id: 6,
    name: 'Джеймс Гандольфини',
    image:
      'https://avatars.mds.yandex.net/i?id=30e86f4fc42a7fc3062ee3c7124ac470_l-12510741-images-thumbs&n=13',
    isDirector: false,
  },
  {
    id: 7,
    name: 'Джеймс Гандольфини',
    image:
      'https://avatars.mds.yandex.net/i?id=30e86f4fc42a7fc3062ee3c7124ac470_l-12510741-images-thumbs&n=13',
    isDirector: false,
  },
];

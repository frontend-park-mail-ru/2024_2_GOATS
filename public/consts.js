// export const API_URL = 'https://6681cdf504acc3545a079ff2.mockapi.io/';
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

export const passwordValidationRules = {
  minLength: {
    pass: false,
    errorMessage: 'Пароль должен содержать минимум 8 символов',
  },
  hasDigit: {
    pass: false,
    errorMessage: 'Пароль должен содержать хотя бы одну цифру',
  },

  reset() {
    const fields = Object.values(this);
    fields.forEach((field) => {
      field.pass = false;
    });
    return this;
  },
};

export const loginValidationRules = {
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

  reset() {
    const fields = Object.values(this);
    fields.forEach((field) => {
      field.pass = false;
    });
    return this;
  },
};

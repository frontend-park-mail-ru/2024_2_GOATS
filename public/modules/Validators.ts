import {
  CHAR_0_CODE,
  CHAR_9_CODE,
  CHAR_A_CODE,
  CHAR_Z_CODE,
  CHAR_a_CODE,
  CHAR_z_CODE,
  passwordValidationRules,
  loginValidationRules,
  avatarValidationRules,
  allowedTypes,
} from '../consts';

export function validateEmailAddress(emailAddress: string): boolean {
  // const regex = /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i;
  const regex = /^[$\/@ "'`.!#\$%&'*+\-=?^_`{|}~a-zA-Z]+\.[a-z]{2,10}$/;
  return regex.test(emailAddress);
}

export function validatePassword(password: string): string | undefined {
  passwordValidationRules.reset();

  if (password.length > 7) {
    passwordValidationRules.rules.minLength.pass = true;
  }

  for (let i = 0; i < password.length; i++) {
    if (!isNaN(Number(password[i]))) {
      passwordValidationRules.rules.hasDigit.pass = true;
      break;
    }
  }

  for (const rule in passwordValidationRules.rules) {
    if (
      !passwordValidationRules.rules[
        rule as keyof typeof passwordValidationRules.rules
      ].pass
    ) {
      return passwordValidationRules.rules[
        rule as keyof typeof passwordValidationRules.rules
      ].errorMessage;
    }
  }
}

export function validateLogin(username: string): string | undefined {
  loginValidationRules.reset();
  if (username.length >= 6) {
    loginValidationRules.rules.minLength.pass = true;
  }

  if (username.length <= 24) {
    loginValidationRules.rules.maxLength.pass = true;
  }

  let isValid = true;
  for (let i = 0; i < username.length; i++) {
    const char = username[i];

    if (
      (char.charCodeAt(0) >= CHAR_A_CODE &&
        char.charCodeAt(0) <= CHAR_Z_CODE) ||
      (char.charCodeAt(0) >= CHAR_a_CODE && char.charCodeAt(0) <= CHAR_z_CODE)
    ) {
      continue;
    }

    if (
      char.charCodeAt(0) >= CHAR_0_CODE &&
      char.charCodeAt(0) <= CHAR_9_CODE
    ) {
      continue;
    }

    if (char === '.') {
      continue;
    }

    isValid = false;
    break;
  }

  loginValidationRules.rules.hasNoSpec.pass = isValid;

  for (const rule in loginValidationRules.rules) {
    if (
      !loginValidationRules.rules[
        rule as keyof typeof loginValidationRules.rules
      ].pass
    ) {
      return loginValidationRules.rules[
        rule as keyof typeof loginValidationRules.rules
      ].errorMessage;
    }
  }
}

export function validateImage(file: File): Promise<string | undefined> {
  return new Promise((resolve) => {
    avatarValidationRules.reset();
    let isTypeValid = false;

    if (allowedTypes.includes(file.type)) {
      isTypeValid = true;
    }

    // Проверка, является ли файл действительно изображением
    const img = new Image();
    img.onload = () => {
      const maxSize = 1 * 1024 * 1024;
      if (file.size > maxSize) {
        resolve('Максималный размер файла - 1 МБ');
        return;
      }
      if (isTypeValid) {
        resolve(undefined);
      } else {
        resolve(`Неверный формат изображения`);
      }
    };

    img.onerror = () => {
      resolve(avatarValidationRules.rules.invalidType.errorMessage);
    };
    img.src = URL.createObjectURL(file);
  });
}

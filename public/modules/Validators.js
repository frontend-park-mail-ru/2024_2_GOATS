import {
  CHAR_0_CODE,
  CHAR_9_CODE,
  CHAR_A_CODE,
  CHAR_Z_CODE,
  CHAR_a_CODE,
  CHAR_z_CODE,
  passwordValidationRules,
  loginValidationRules,
} from '../consts';

/**
 * Email validation
 * @param {string} emailAddress - email value
 * @returns {boolean} - true if email value is valid
 */
export function validateEmailAddress(emailAddress) {
  const regex = /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i;

  return regex.test(emailAddress);
}

/**
 * Password validation
 * @param {string} password - password value
 * @returns {boolean} - true if password value is valid
 */
export function validatePassword(password) {
  passwordValidationRules.reset();

  if (password.length > 7) {
    passwordValidationRules.minLength.pass = true;
  }

  for (let i = 0; i < password.length; i++) {
    if (!isNaN(password[i])) {
      passwordValidationRules.hasDigit.pass = true;
      break;
    }
  }

  for (const rule in passwordValidationRules) {
    if (!passwordValidationRules[rule].pass) {
      return passwordValidationRules[rule].errorMessage;
    }
  }
}

/**
 * Login validation
 * @param {string} username - username value
 * @returns {boolean} - true if username value is valid
 */
export function validateLogin(username) {
  loginValidationRules.reset();
  if (username.length >= 6) {
    loginValidationRules.minLength.pass = true;
  }

  if (username.length <= 24) {
    loginValidationRules.maxLength.pass = true;
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

  loginValidationRules.hasNoSpec.pass = isValid;

  for (const rule in loginValidationRules) {
    if (!loginValidationRules[rule].pass) {
      return loginValidationRules[rule].errorMessage;
    }
  }
}

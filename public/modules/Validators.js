/**
 * Email validation
 * @param {string} emailAddress - email value
 * @returns {boolean} - true if email value is valid
 */
export function validateEmailAddress(emailAddress) {
  let atSymbol = emailAddress.indexOf('@');
  let dotSymbol = emailAddress.lastIndexOf('.');
  let spaceSymbol = emailAddress.indexOf(' ');
  let doubleDotSymbol = emailAddress.indexOf('..');

  if (
    atSymbol != -1 &&
    atSymbol != 0 &&
    dotSymbol != -1 &&
    dotSymbol != 0 &&
    dotSymbol > atSymbol + 1 &&
    emailAddress.length > dotSymbol + 1 &&
    spaceSymbol == -1 &&
    doubleDotSymbol == -1
  ) {
    return true;
  } else {
    return false;
  }
}

/**
 * Password validation
 * @param {string} password - password value
 * @returns {boolean} - true if password value is valid
 */
export function validatePassword(password) {
  if (password.length < 8) {
    return false;
  }

  let hasDigit = false;
  for (let i = 0; i < password.length; i++) {
    if (!isNaN(password[i])) {
      hasDigit = true;
      break;
    }
  }

  return hasDigit;
}

// TODO: уточнить (сейчас проверяем на длину, только англ символы и разрешение .)
/**
 * Login validation
 * @param {string} username - username value
 * @returns {boolean} - true if username value is valid
 */
export function validateLogin(username) {
  if (username.length <= 5) {
    return false;
  }

  let isValid = true;
  for (let i = 0; i < username.length; i++) {
    let char = username[i];

    if (
      (char.charCodeAt(0) >= 65 && char.charCodeAt(0) <= 90) ||
      (char.charCodeAt(0) >= 97 && char.charCodeAt(0) <= 122)
    ) {
      continue;
    }

    if (char.charCodeAt(0) >= 48 && char.charCodeAt(0) <= 57) {
      continue;
    }

    if (char === '.') {
      continue;
    }

    isValid = false;
    break;
  }

  return isValid;
}

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

// TODO: добавить условия
export function validatePassword(password) {
  if (password.length >= 8) {
    return true;
  } else {
    return false;
  }
}

// TODO: уточнить (сейчас проверяем на длину, только англ символы и разрешение .)
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

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

import { validatePassword } from './Validators';

export const validatePasswordCreation = (
  passwordValue: string,
  passwordInput: HTMLElement,
  passwordError: HTMLElement,
) => {
  if (validatePassword(passwordValue)) {
    passwordInput.classList.add('input-error');
    const error = validatePassword(passwordValue);
    if (error) {
      passwordError.innerText = error;
    }

    return false;
  } else {
    passwordInput.classList.remove('input-error');
    passwordError.innerText = '';
    return true;
  }
};

export const validatePasswordConfirmation = (
  passwordValue: string,
  passwordConfirmValue: string,
  passwordConfirmInput: HTMLElement,
  passwordConfirmError: HTMLElement,
) => {
  if (passwordValue !== passwordConfirmValue) {
    passwordConfirmInput.classList.add('input-error');
    passwordConfirmError.innerText = 'Пароли должны совпадать';
    return false;
  } else {
    passwordConfirmInput.classList.remove('input-error');
    passwordConfirmError.innerText = '';
    return true;
  }
};

export const throwBackendError = (
  form: 'auth' | 'reg',
  errorMessage: string,
) => {
  let errorBlock;

  if (form === 'auth') {
    errorBlock = document.getElementById('auth-error') as HTMLElement;
  } else if (form === 'reg') {
    errorBlock = document.getElementById('reg-error') as HTMLElement;
  }

  if (errorBlock) {
    errorBlock.innerHTML = errorMessage;
    errorBlock.classList.add('visible');
  }
};

export const removeBackendError = (form: 'auth' | 'reg') => {
  let errorBlock;

  if (form === 'auth') {
    errorBlock = document.getElementById('auth-error') as HTMLElement;
  } else if (form === 'reg') {
    errorBlock = document.getElementById('reg-error') as HTMLElement;
  }

  if (errorBlock) {
    errorBlock.innerHTML = '';
    errorBlock.classList.remove('visible');
  }
};

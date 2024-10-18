import { validatePassword } from 'modules/Validators';
import template from './PasswordChangeModal.hbs';
import { Actions } from 'flux/Actions';
import { ProfilePageStore, profilePageStore } from 'store/ProfilePageStore';
// import { profilePageStore } from 'store/ProfilePageStore';
export class PasswordChangeModal {
  //   private profilePageStore: ProfilePageStore;

  constructor() {
    // this.profilePageStore = profilePageStore;

    const unsubscribe = profilePageStore.passwordChangedEmitter$.addListener(
      (status) => {
        if (status) {
          this.hideModal();
        }
      },
    );

    this.ngOnDestroy = () => {
      unsubscribe();
    };
  }
  ngOnDestroy(): void {}

  validatePrevPasswordField(passwordValue: string): boolean {
    const passwordInput = document.getElementById(
      'password-prev-value',
    ) as HTMLElement;
    const passwordError = document.getElementById(
      'password-modal-prev-password-error',
    ) as HTMLElement;

    if (passwordValue == '') {
      passwordInput.classList.add('input-error');
      passwordError.innerText = 'Поле не может быть пустым';
      return false;
    } else {
      passwordInput.classList.remove('input-error');
      passwordError.innerText = '';
      return true;
    }
  }

  validateNewPasswordField(passwordValue: string): boolean {
    const passwordInput = document.getElementById(
      'password-new-value',
    ) as HTMLElement;
    const passwordError = document.getElementById(
      'password-modal-new-password-error',
    ) as HTMLElement;

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
  }

  validatePasswordConrirmField(
    passwordValue: string,
    passwordConfirmValue: string,
  ) {
    const passwordConfirmInput = document.getElementById(
      'password-confirm-new-value',
    ) as HTMLElement;
    const passwordConfirmError = document.getElementById(
      'password-modal-confirm-new-password-error',
    ) as HTMLElement;

    if (passwordValue !== passwordConfirmValue) {
      passwordConfirmInput.classList.add('input-error');
      passwordConfirmError.innerText = 'Пароли должны совпадать';
      return false;
    } else {
      passwordConfirmInput.classList.remove('input-error');
      passwordConfirmError.innerText = '';
      return true;
    }
  }

  onSubmitClick() {
    const confirmButton = document.getElementById(
      'password-modal-confirm-btn',
    ) as HTMLButtonElement;

    confirmButton.addEventListener('click', (e) => {
      e.preventDefault;
      const prevPasswordValue = (<HTMLInputElement>(
        document.getElementById('password-prev-value')
      )).value;
      const newPasswordValue = (<HTMLInputElement>(
        document.getElementById('password-new-value')
      )).value;
      const newPasswordComfirmValue = (<HTMLInputElement>(
        document.getElementById('password-confirm-new-value')
      )).value;

      const isPrevPasswordValid =
        this.validatePrevPasswordField(prevPasswordValue);
      const isNewPasswordValid =
        this.validateNewPasswordField(newPasswordValue);
      const isPasswordConfirmValid = this.validatePasswordConrirmField(
        newPasswordValue,
        newPasswordComfirmValue,
      );
      if (
        !isNewPasswordValid ||
        !isPasswordConfirmValid ||
        !isPrevPasswordValid
      ) {
        return;
      }

      Actions.changePassword({
        prevPasswordValue,
        newPasswordValue,
        newPasswordComfirmValue,
      });
    });
  }

  render() {
    const root = document.getElementById('root');
    if (root) {
      root.insertAdjacentHTML('beforeend', template());
      root.style.overflow = 'hidden';
    }

    const modal = document.getElementById('password-modal');
    const modalContent = document.getElementById('password-modal-content');
    if (modalContent && modal) {
      modalContent.addEventListener('click', (event) => {
        event.stopPropagation();
      });

      setTimeout(() => {
        modal.classList.add('password-modal__active');
        modalContent.classList.add('password-modal__content_active');
      }, 0);

      modal.addEventListener('click', () => this.hideModal());
    }

    const cancelButton = document.getElementById('password-modal-cancel-btn');

    if (cancelButton) {
      cancelButton.addEventListener('click', () => {
        this.hideModal();
      });
    }

    this.onSubmitClick();
  }

  hideModal() {
    const root = document.getElementById('root');
    const modal = document.getElementById('password-modal');
    const modalContent = document.getElementById('password-modal-content');

    if (root) {
      root.style.overflow = 'auto';
    }

    if (modal && modalContent) {
      modal.classList.remove('password-modal__active');
      modalContent.classList.remove('password-modal__content_active');

      // Ждем пока transition завершится и только после этого удаляем модальное окно из DOM
      modal.addEventListener(
        'transitionend',
        () => {
          modal.remove();
        },
        { once: true },
      );
    }
  }

  renderTemplate() {}
}

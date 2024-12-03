import { profilePageStore } from 'store/ProfilePageStore';
import template from './ProfilePage.hbs';
import { PasswordChangeModal } from 'components/PasswordChangeModal/PasswordChangeModal';
import { Actions } from 'flux/Actions';
import { AvatarComponent } from 'components/AvatarComponent/AvatarComponent';
import {
  validateEmailAddress,
  validateImage,
  validateLogin,
} from 'modules/Validators';
import { userStore } from 'store/UserStore';
import { ConfirmModal } from 'components/ConfirmModal/ConfirmModal';
import { Notifier } from 'components/Notifier/Notifier';

export class ProfilePage {
  #userAvatar!: File;
  #notifier!: Notifier;

  constructor() {}

  render() {
    this.renderTemplate();
  }

  handlePasswordChangeClick() {
    const modal = new PasswordChangeModal();
    const passwordChangeButton = document.getElementById(
      'security-change-btn',
    ) as HTMLElement;
    passwordChangeButton.addEventListener('click', () => {
      modal.render();
    });
  }

  validateLoginField(loginValue: string) {
    const loginInput = document.getElementById(
      'user-change-login',
    ) as HTMLElement;
    const loginError = document.getElementById(
      'user-change-login-error',
    ) as HTMLElement;
    if (validateLogin(loginValue)) {
      loginInput.classList.add('input-error');
      const error = validateLogin(loginValue);
      if (error) {
        loginError.innerText = error;
      }
      return false;
    } else {
      loginInput.classList.remove('input-error');
      loginError.innerText = '';
      return true;
    }
  }

  validateEmailField(emailValue: string) {
    const emailInput = document.getElementById(
      'user-change-email',
    ) as HTMLElement;
    const emailError = document.getElementById(
      'user-change-email-error',
    ) as HTMLElement;

    if (!validateEmailAddress(emailValue)) {
      emailInput.classList.add('input-error');
      emailError.innerText = 'Некорректный e-mail';
      return false;
    } else {
      emailInput.classList.remove('input-error');
      emailError.innerText = '';
      return true;
    }
  }

  handleUserInfoChangeClick() {
    const userInfoChangeButton = document.getElementById(
      'user-change-btn',
    ) as HTMLButtonElement;

    userInfoChangeButton.addEventListener('click', (e) => {
      e.preventDefault;

      const emailValue = (<HTMLInputElement>(
        document.getElementById('user-change-email')
      )).value;
      const loginValue = (<HTMLInputElement>(
        document.getElementById('user-change-login')
      )).value;

      const isEmailValid = this.validateEmailField(emailValue);
      const isLoginValid = this.validateLoginField(loginValue);

      if (!isEmailValid || !isLoginValid) {
        return;
      }
      Actions.changeUserInfo({
        email: emailValue,
        username: loginValue,
        avatar: this.#userAvatar,
      });
    });
  }

  renderAvatar(image: string) {
    const avatarContainer = document.getElementById(
      'user-profile-avatar-container',
    ) as HTMLElement;

    const avatarComponent = new AvatarComponent(avatarContainer, image);
    avatarComponent.render();
  }

  async validateAvatarField(file: File): Promise<boolean> {
    const imageError = document.getElementById(
      'user-image-type-error',
    ) as HTMLElement;

    const imageErrorMessage = await validateImage(file);

    if (imageErrorMessage) {
      this.#notifier = new Notifier('error', imageErrorMessage, 3000);
      this.#notifier.render();
      return Promise.resolve(false);
    } else {
      imageError.innerText = '';
      return Promise.resolve(true);
    }
  }

  async uploadAvatar(event: Event) {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];

      const isValid = await this.validateAvatarField(file);

      if (isValid) {
        const avatarUrl = URL.createObjectURL(file);
        this.#userAvatar = file;
        this.renderAvatar(avatarUrl);
        this.controlButtonDisable();
      }
    }
  }

  listenInputsChange() {
    const usernameInput = document.getElementById(
      'user-change-login',
    ) as HTMLInputElement;
    const emailInput = document.getElementById(
      'user-change-email',
    ) as HTMLInputElement;
    const avatarInput = document.getElementById(
      'upload-avatar-input',
    ) as HTMLInputElement;

    emailInput.addEventListener('input', () => {
      this.controlButtonDisable();
    });

    usernameInput.addEventListener('input', () => {
      this.controlButtonDisable();
    });

    // avatarInput.addEventListener('change', () => {
    //   this.controlButtonDisable();
    // });
  }

  controlButtonDisable() {
    const emailValue = (<HTMLInputElement>(
      document.getElementById('user-change-email')
    )).value;
    const usernameValue = (<HTMLInputElement>(
      document.getElementById('user-change-login')
    )).value;

    const submitButton = document.getElementById(
      'user-change-btn',
    ) as HTMLButtonElement;

    if (
      usernameValue !== userStore.getUser().username ||
      emailValue !== userStore.getUser().email ||
      this.#userAvatar !== undefined
    ) {
      submitButton.classList.remove('disable');
      submitButton.disabled = false;
    } else {
      submitButton.classList.add('disable');
      submitButton.disabled = true;
    }
  }

  onExitClick() {
    if (userStore.getUserAuthStatus()) {
      const modal = new ConfirmModal(
        'Вы уверены, что хотите выйти?',
        true,
        () => {
          profilePageStore.logout();
        },
      );
      const exitButton = document.getElementById('exit-button') as HTMLElement;
      exitButton.addEventListener('click', () => {
        modal.render();
      });
    }
  }

  onSubscribeClick() {
    const subscribtionButton = document.getElementById(
      'subscription-btn',
    ) as HTMLButtonElement;

    if (subscribtionButton) {
      subscribtionButton.addEventListener('click', () => {
        console.log('subs click');
      });
    }
  }

  onCancelSubscriptionClick() {
    const calcelSubscriptionButton = document.getElementById(
      'subscription-cancel-btn',
    ) as HTMLButtonElement;

    if (calcelSubscriptionButton) {
      calcelSubscriptionButton.addEventListener('click', () => {
        console.log('cancel subs click');
      });
    }
  }

  renderTemplate() {
    const pageElement = document.getElementsByTagName('main')[0];

    pageElement.innerHTML = template({
      user: profilePageStore.getUserInfo(),
    });
    this.renderAvatar(profilePageStore.getUserInfo().avatar);

    this.handlePasswordChangeClick();
    this.handleUserInfoChangeClick();

    const fileInput = document.getElementById(
      'upload-avatar-input',
    ) as HTMLInputElement;

    if (fileInput) {
      fileInput.addEventListener('change', this.uploadAvatar.bind(this));
    }

    this.onExitClick();
    this.listenInputsChange();
    this.onSubscribeClick();
    this.onCancelSubscriptionClick();
  }
}

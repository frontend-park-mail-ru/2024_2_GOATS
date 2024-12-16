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

    const subscriptionForm = document.getElementById(
      'subscription-form',
    ) as HTMLFormElement;

    const subscriptionFormLabel = document.getElementById(
      'subscription-form-label',
    ) as HTMLInputElement;

    if (subscribtionButton) {
      subscribtionButton.addEventListener('click', (event) => {
        event.preventDefault();
        Actions.buySubscription({ subscriptionForm, subscriptionFormLabel });
      });
    }
  }

  getCountDaysString() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
    const currentDay = String(currentDate.getDate()).padStart(2, '0');

    const currentDateArray = [currentYear.toString(), currentMonth, currentDay];

    const expirationDateArray = userStore.getUser().expirationDate.split('-');

    const currentYearNum = parseInt(currentDateArray[0], 10);
    const currentMonthNum = parseInt(currentDateArray[1], 10);
    const currentDayNum = parseInt(currentDateArray[2], 10);

    const expirationYearNum = parseInt(expirationDateArray[0], 10);
    const expirationMonthNum = parseInt(expirationDateArray[1], 10);
    const expirationDayNum = parseInt(expirationDateArray[2], 10);

    const currentDateObj = new Date(
      currentYearNum,
      currentMonthNum - 1,
      currentDayNum,
      0,
      0,
      0,
    );
    const expirationDateObj = new Date(
      expirationYearNum,
      expirationMonthNum - 1,
      expirationDayNum,
      0,
      0,
      0,
    );

    const differenceInTime =
      expirationDateObj.getTime() - currentDateObj.getTime();

    const differenceInDays = Math.ceil(
      differenceInTime / (1000 * 60 * 60 * 24),
    );

    if ([1, 21, 31].includes(differenceInDays)) {
      return String(differenceInDays) + ' день';
    } else if ([2, 3, 4, 22, 23, 24].includes(differenceInDays)) {
      return String(differenceInDays) + ' дня';
    } else {
      return String(differenceInDays) + ' дней';
    }
  }

  renderTemplate() {
    const pageElement = document.getElementsByTagName('main')[0];

    pageElement.innerHTML = template({
      user: profilePageStore.getUserInfo(),
      ...(userStore.getUser().expirationDate && {
        expirationDays: this.getCountDaysString(),
      }),
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
  }
}

import { profilePageStore } from 'store/ProfilePageStore';
import template from './ProfilePage.hbs';
import { PasswordChangeModal } from 'components/PasswordChangeModal/PasswordChangeModal';
import { Actions } from 'flux/Actions';
import { AvatarComponent } from 'components/AvatarComponent/AvatarComponent';
import { UserData } from 'types/user';
import { validateEmailAddress, validateLogin } from 'modules/Validators';

const mockUser = {
  email: 'sasa@mail.ru',
  username: 'sasa1234',
  name: '',
  avatar: '', //assets/mockImages/user-profile_image.png
};

const defAvatar = 'assets/mockImages/defAvatar.png';

export class ProfilePage {
  // #user: UserData;
  #userAvatar!: string;

  constructor() {
    // this.#user = profilePageStore.getUserInfo();
  }

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
      const nameValue = (<HTMLInputElement>(
        document.getElementById('user-change-name')
      )).value;

      const isEmailValid = this.validateEmailField(emailValue);
      const isLoginValid = this.validateLoginField(loginValue);

      if (!isEmailValid || !isLoginValid) {
        return;
      }
      // mockUser.avatar = this.#userAvatar; //!!!!!!!!!!!!!!!
      console.log('avatar', this.#userAvatar);
      Actions.changeUserInfo({
        email: emailValue,
        username: loginValue,
        name: nameValue,
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

  uploadAvatar(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      const avatarUrl = URL.createObjectURL(fileInput.files[0]);
      this.#userAvatar = avatarUrl;
      this.renderAvatar(avatarUrl);
    }
  }

  renderTemplate() {
    const pageElement = document.getElementsByTagName('main')[0];

    pageElement.innerHTML = template({
      user: profilePageStore.getUserInfo(),
    });

    const avatar = profilePageStore.getUserInfo().avatar
      ? profilePageStore.getUserInfo().avatar
      : defAvatar;
    this.renderAvatar(avatar);

    this.handlePasswordChangeClick();
    this.handleUserInfoChangeClick();

    const fileInput = document.getElementById(
      'upload-avatar-input',
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.addEventListener('change', this.uploadAvatar.bind(this));
    }
  }
}

import { profilePageStore } from 'store/ProfilePageStore';
import template from './ProfilePage.hbs';
import { PasswordChangeModal } from 'components/PasswordChangeModal/PasswordChangeModal';
import { Actions } from 'flux/Actions';
import { AvatarComponent } from 'components/AvatarComponent/AvatarComponent';
import { UserData } from 'types/user';

const mockUser = {
  email: 'sasa@mail.ru',
  username: 'sasa1234',
  name: '',
  avatar: '', //assets/mockImages/user-profile_image.png
};

const defAvatar = 'assets/mockImages/defAvatar.png';

export class ProfilePage {
  #user: UserData;
  #userAvatar!: string;

  constructor() {
    this.#user = profilePageStore.getUserInfo();
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

  handleUserInfoChangeClick() {
    const userInfoChangeButton = document.getElementById(
      'user-change-btn',
    ) as HTMLButtonElement;

    userInfoChangeButton.addEventListener('click', (e) => {
      e.preventDefault;
      // mockUser.avatar = this.#userAvatar; //!!!!!!!!!!!!!!!
      Actions.changeUserInfo(this.#user);
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
      this.#user.avatar = avatarUrl;
      this.renderAvatar(avatarUrl);
    }
  }

  renderTemplate() {
    const pageElement = document.getElementsByTagName('main')[0];
    const avatar = this.#user.avatar ? this.#user.avatar : defAvatar;
    pageElement.innerHTML = template({
      user: this.#user,
    });
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

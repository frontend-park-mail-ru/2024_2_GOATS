import { profilePageStore } from 'store/ProfilePageStore';
import template from './ProfilePage.hbs';
import { PasswordChangeModal } from 'components/PasswordChangeModal/PasswordChangeModal';

export class ProfilePage {
  render() {
    this.renderTemplate();
  }

  handlePasswordChangeClick() {
    const modal = new PasswordChangeModal('Смена пароля', () => {
      alert('aaa');
    });
    const passwordChangeButton = document.getElementById(
      'security-change-btn',
    ) as HTMLElement;
    passwordChangeButton.addEventListener('click', () => {
      modal.render();
    });
  }

  renderTemplate() {
    console.log('0000000000000');
    const pageElement = document.getElementsByTagName('main')[0];
    pageElement.innerHTML = template({ user: profilePageStore.getUserInfo() });
    this.handlePasswordChangeClick();
  }
}

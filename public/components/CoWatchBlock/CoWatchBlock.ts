import template from './CoWatchBlock.hbs';
import { userStore } from 'store/UserStore';
import { Actions } from 'flux/Actions';
import { CreateRoomModal } from 'components/CreateRoomModal/CreateRoomModal';
import { router } from 'modules/Router';
import { Notifier } from 'components/Notifier/Notifier';

export class CoWatchBlock {
  #parent: HTMLElement;
  #isLoading: boolean;

  constructor(parent: HTMLElement, isLoading: boolean) {
    this.#parent = parent;
    this.#isLoading = isLoading;
  }

  render() {
    this.renderTemplate();
  }

  handleCreateRoomClick() {
    const createRoomButton = document.getElementById(
      'cowatch-block-create-room-btn',
    ) as HTMLElement;

    if (createRoomButton) {
      createRoomButton.addEventListener('click', () => {
        const modal = new CreateRoomModal();
        modal.render();
      });
    }
  }

  onSubscribeClick() {
    const subscribtionButton = document.getElementById(
      'buy-subscription',
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
        if (userStore.getUser().username) {
          Actions.buySubscription({ subscriptionForm, subscriptionFormLabel });
        } else {
          const notifier = new Notifier(
            'error',
            'Сначала необходимо войти в аккаунт',
            3000,
          );
          notifier.render();
          router.go('/auth');
        }
      });
    }
  }

  renderTemplate() {
    this.#parent.innerHTML = template({
      isPremium: userStore.getUser().isPremium,
      isLoading: this.#isLoading,
    });

    this.onSubscribeClick();
    this.handleCreateRoomClick();
  }
}

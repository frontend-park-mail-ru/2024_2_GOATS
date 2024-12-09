import template from './CoWatchBlock.hbs';
import { userStore } from 'store/UserStore';
import { Actions } from 'flux/Actions';
import { CreateRoomModal } from 'components/CreateRoomModal/CreateRoomModal';

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
    const modal = new CreateRoomModal();
    const createRoomButton = document.getElementById(
      'cowatch-block-create-room-btn',
    ) as HTMLElement;

    if (createRoomButton) {
      createRoomButton.addEventListener('click', () => {
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
        Actions.buySubscription({ subscriptionForm, subscriptionFormLabel });
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

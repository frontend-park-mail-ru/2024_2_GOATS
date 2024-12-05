import template from './CoWatchBlock.hbs';
import { userStore } from 'store/UserStore';
import { Actions } from 'flux/Actions';

export class CoWatchBlock {
  #parent: HTMLElement;

  constructor(parent: HTMLElement) {
    this.#parent = parent;
  }

  render() {
    this.renderTemplate();
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
    });

    this.onSubscribeClick();
  }
}

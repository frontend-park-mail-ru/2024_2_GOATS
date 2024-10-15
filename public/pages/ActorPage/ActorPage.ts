import { Loader } from 'components/Loader/Loader';
import { ActorPageStore, actorPageStore } from 'store/ActorPageStore';
import { Actor } from 'types/actor';
import template from './ActorPage.hbs';
import { CardsList } from 'components/CardsList/CardsList';

export class ActorPage {
  //   #isBiographyExpanded: boolean;
  //   //   #loader!: Loader;
  //   //   #actor: Actor;

  //   constructor() {
  //     this.#isBiographyExpanded = false;
  //   }

  render() {
    this.renderTemplate();
  }

  getActorInfo() {
    return actorPageStore.getActor();
  }

  toggleBiographyExpansion() {
    const toggleButton = document.getElementById(
      'biography-toggler',
    ) as HTMLElement;
    const biographyText = document.getElementById(
      'biography-text',
    ) as HTMLElement;
    const togglerDesc = document.getElementById(
      'biography-toggler-desc',
    ) as HTMLElement;

    const togglerIcon = document.getElementById(
      'biography-toggler-icon',
    ) as HTMLElement;
    toggleButton.addEventListener('click', () => {
      biographyText.classList.toggle('opened');
      togglerDesc.classList.toggle('more');
      togglerDesc.classList.toggle('less');
      togglerIcon.classList.toggle('less');
    });
  }

  renderTemplate() {
    const pageElement = document.getElementsByTagName('main')[0];
    pageElement.innerHTML = template({ actor: this.getActorInfo() });

    const actorFilmography = document.getElementById(
      'actor-page-filmography',
    ) as HTMLElement;
    const cards = new CardsList(
      actorFilmography,
      this.getActorInfo().movies,
      4,
    );
    cards.render();

    this.toggleBiographyExpansion();
  }
}

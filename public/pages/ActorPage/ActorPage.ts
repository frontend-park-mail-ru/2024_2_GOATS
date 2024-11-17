import { Loader } from 'components/Loader/Loader';
import { ActorPageStore, actorPageStore } from 'store/ActorPageStore';
import { Actor } from 'types/actor';
import template from './ActorPage.hbs';
import skeletonTemplate from './ActorPageSkeleton.hbs';
import { CardsList } from 'components/CardsList/CardsList';
import { dateFormatter } from 'modules/DateFormatter';

export class ActorPage {
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
    window.scrollTo(0, 0);

    if (0) {
      pageElement.innerHTML = template({
        actor: this.getActorInfo(),
        birthDate: dateFormatter(this.getActorInfo()?.birthdate as string),
      });

      const actorFilmography = document.getElementById(
        'actor-page-filmography',
      ) as HTMLElement;

      const cards = new CardsList(
        actorFilmography,
        4,
        this.getActorInfo()?.movies,
      );
      cards.render();

      this.toggleBiographyExpansion();
    } else {
      pageElement.innerHTML = skeletonTemplate();
      const actorFilmography = document.querySelector(
        '.actor-page-skeleton__filmography',
      ) as HTMLElement;
      const cards = new CardsList(actorFilmography, 4);
      cards.render();
    }
  }
}

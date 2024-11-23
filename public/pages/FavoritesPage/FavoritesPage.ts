import template from './FavoritesPage.hbs';
import { favoritesPageStore } from 'store/FavoritesPageStore';
import { Movie } from 'types/movie';
import { CardsList } from 'components/CardsList/CardsList';

export class FavoritesPage {
  #movies: Movie[] | null = null;

  render() {
    this.#movies = favoritesPageStore.getMovies();
    this.renderTemplate();
  }
  renderTemplate() {
    const pageElement = document.getElementsByTagName('main')[0];
    pageElement.innerHTML = template({ isEmpty: this.#movies?.length === 0 });

    const favoritesContainer = document.querySelector(
      '.favorites-page__container',
    ) as HTMLDListElement;

    if (this.#movies !== null) {
      const cardsList = new CardsList(favoritesContainer, 1, this.#movies);
      cardsList.render();
    }
  }
}

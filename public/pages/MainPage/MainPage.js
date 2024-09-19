import { CardsList } from '../../components/CardsList/CardsList';
import { movies } from '../../consts';

export class MainPage {
  #parent;

  constructor(parent) {
    this.#parent = parent;
  }

  render() {
    this.renderTemplate();
  }

  renderTemplate() {
    const template = Handlebars.templates['MainPage.hbs'];
    this.#parent.innerHTML = template();

    const bestMoviesBlock = document.getElementById('best-movies-block');
    const bestMoviesList = new CardsList(bestMoviesBlock, movies, 1);
    bestMoviesList.render();

    const newMoviesBlock = document.getElementById('new-movies-block');
    const newMoviesList = new CardsList(newMoviesBlock, movies, 2);
    newMoviesList.render();
  }
}

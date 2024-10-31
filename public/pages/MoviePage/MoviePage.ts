import template from './MoviePage.hbs';
import { Loader } from '../../components/Loader/Loader';
import { MovieDetailed } from 'types/movie';
import { moviePageStore } from 'store/MoviePageStore';
import { MovieDescription } from 'components/MovieDescription/MovieDescription';
import { Slider } from 'components/Slider/Slider';
import { mockSeries } from '../../consts';

export class MoviePage {
  #movie!: MovieDetailed;
  #loader!: Loader;

  constructor() {}

  render() {
    console.log('RENDER MOVIE PAGE');
    this.#movie = moviePageStore.getMovie();
    this.renderTemplate();
  }

  onVideoBackClick() {
    this.renderTemplate();
  }

  renderBlocks() {
    const movieDescriptionContainer = document.getElementById(
      'movie-description-container',
    ) as HTMLElement;
    const movieDescription = new MovieDescription(
      movieDescriptionContainer,
      () => console.log('favorite'),
      this.onVideoBackClick.bind(this),
    );
    movieDescription.render();

    // TODO: Серии добавить только к 3 РК
    // const seriesBlock = document.getElementById(
    //   'movie-page-series',
    // ) as HTMLElement;
    // const seriesSlider = new Slider(seriesBlock, undefined, mockSeries);
    // seriesSlider.render();

    const personsBlock = document.getElementById(
      'movie-page-persons',
    ) as HTMLElement;
    const personsSlider = new Slider(
      personsBlock,
      undefined,
      undefined,
      this.#movie.actors,
    );
    personsSlider.render();
  }

  renderTemplate() {
    const pageElement = document.getElementsByTagName('main')[0];
    window.scrollTo(0, 0);

    this.#loader = new Loader(pageElement, template());
    if (this.#movie) {
      pageElement.innerHTML = template({
        longDescription: this.#movie.longDescription,
      });
      this.renderBlocks();
    } else {
      this.#loader.render();
    }
  }
}

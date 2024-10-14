import template from './MoviePage.hbs';
import { Loader } from '../../components/Loader/Loader';
import { MovieDetailed } from 'types/movie';
import { moviePageStore } from 'store/MoviePageStore';
import { MovieDescription } from 'components/MovieDescription/MovieDescription';
import { Slider } from 'components/Slider/Slider';

export class MoviePage {
  #movie!: MovieDetailed;
  #loader!: Loader;

  constructor() {}

  render() {
    console.log('RENDER MOVIE PAGE');
    this.#movie = moviePageStore.getMovie();
    this.renderTemplate();
  }

  renderBlocks() {
    const movieDescriptionContainer = document.getElementById(
      'movie-description-container',
    ) as HTMLElement;
    console.log(movieDescriptionContainer);
    const movieDescription = new MovieDescription(movieDescriptionContainer);
    movieDescription.render();

    const series = [
      {
        id: 1,
        position: 1,
        title: 'Серия 1',
        image:
          'https://deadline.com/wp-content/uploads/2021/09/The-Many-Saints-Of-Newark.jpg',
      },
      {
        id: 2,
        position: 2,
        title: 'Серия 2',
        image:
          'https://deadline.com/wp-content/uploads/2021/09/The-Many-Saints-Of-Newark.jpg',
      },
      {
        id: 3,
        position: 3,
        title: 'Серия 3',
        image:
          'https://deadline.com/wp-content/uploads/2021/09/The-Many-Saints-Of-Newark.jpg',
      },
      {
        id: 4,
        position: 4,
        title: 'Серия 4',
        image:
          'https://deadline.com/wp-content/uploads/2021/09/The-Many-Saints-Of-Newark.jpg',
      },
      {
        id: 5,
        position: 5,
        title: 'Серия 5',
        image:
          'https://deadline.com/wp-content/uploads/2021/09/The-Many-Saints-Of-Newark.jpg',
      },
    ];

    const seriesBlock = document.getElementById(
      'movie-page-series',
    ) as HTMLElement;
    console.log('series block', seriesBlock);
    const slider = new Slider(seriesBlock, undefined, series);
    slider.render();
  }

  renderTemplate() {
    const pageElement = document.getElementsByTagName('main')[0];
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

import { dispatcher } from 'flux/Dispatcher';
import { ActionTypes } from 'flux/ActionTypes';
import { MoviePage } from 'pages/MoviePage/MoviePage';
import { apiClient } from 'modules/ApiClient';
import { MovieDetailed } from 'types/movie';

const moviePage = new MoviePage();

class MoviePageStore {
  #movie!: MovieDetailed;

  constructor() {
    dispatcher.register(this.reduce.bind(this));
  }

  setState(movie: MovieDetailed) {
    this.#movie = movie;
  }

  getMovie() {
    return this.#movie;
  }

  async getMovieRequest() {
    // Пока оставил запрос из другой страницы для теста
    const response = await apiClient.get({
      path: 'movie_collections/',
    });

    const movie = {
      id: 1,
      title: 'Сопрано',
      titleImage:
        'https://i.pinimg.com/originals/93/c7/54/93c754126bcdecb6e540e02631f5eda1.png',
      shortDescription:
        'Мафиозный босс Нью-Джерси обращается за помощью к психологу. Культовый сериал, ставший образцом гангстерскогокино',
      longDescription:
        'Сюжет и Основная Идея: "Клан Сопрано" предлагает зрителю уникальную возможность погрузиться в жизнь Тони Сопрано, главы мафиозной семьи в Нью-Джерси. Великолепно сыгранный Джеймсом Гандольфини, Тони Сопрано становится центром вселенной, где переплетаются его внутренние конфликты, семейные проблемы и криминальные дела.',
      image:
        'https://vmndims.binge.com.au/api/v2/img/5e83d70ae4b05b02f51a5d97-1693369925684?location=tile&amp;imwidth=1280',
      rating: 10,
      releaseDate: '13.09.1999',
      country: 'США',
      director: 'Тимоти Ван Паттен',
      isSerial: false,
    };

    this.setState(movie);
    moviePage.render();
  }

  async reduce(action: any) {
    console.log(action);
    switch (action.type) {
      case ActionTypes.RENDER_MOVIE_PAGE:
        moviePage.render();
        await this.getMovieRequest();
        break;
      default:
        break;
    }
  }
}

export const moviePageStore = new MoviePageStore();

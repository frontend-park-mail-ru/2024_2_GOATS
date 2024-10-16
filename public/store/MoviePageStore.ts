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
        'https://avatars.mds.yandex.net/i?id=47e4f9e1d2423964f4db57f4db284b2e_l-5350095-images-thumbs&n=13',
      rating: 10,
      releaseDate: '13.09.1999',
      country: 'США',
      director: 'Тимоти Ван Паттен',
      isSerial: false,
      video:
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
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

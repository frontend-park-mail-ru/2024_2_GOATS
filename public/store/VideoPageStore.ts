import { dispatcher } from 'flux/Dispatcher';
import { ActionTypes } from 'flux/ActionTypes';
import { VideoPage } from 'pages/VideoPage/VideoPage';
import { apiClient } from 'modules/ApiClient';
import { MovieDetailed } from 'types/movie';

const videoPage = new VideoPage();

class VideoPageStore {
  #video!: string;

  constructor() {
    dispatcher.register(this.reduce.bind(this));
  }

  setState(video: string) {
    this.#video = video;
  }

  getVideo() {
    return this.#video;
  }

  async getVideoRequest() {
    // Пока оставил запрос из другой страницы для теста
    const response = await apiClient.get({
      path: 'movie_collections/',
    });

    const video =
      'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

    this.setState(video);
    videoPage.render();
  }

  async reduce(action: any) {
    console.log(action);
    switch (action.type) {
      case ActionTypes.RENDER_VIDEO_PAGE:
        videoPage.render();
        await this.getVideoRequest();
        break;
      default:
        break;
    }
  }
}

export const videoPageStore = new VideoPageStore();

import { Loader } from '../../components/Loader/Loader';
import template from './VideoPage.hbs';
import { VideoPlayer } from 'components/VideoPlayer/VideoPlayer';
import { videoPageStore } from 'store/VideoPageStore';

export class VideoPage {
  #video!: string;
  #loader!: Loader;

  constructor() {}

  render() {
    this.#video = videoPageStore.getVideo();
    this.renderTemplate();
  }

  renderTemplate() {
    const pageElement = document.getElementsByTagName('main')[0];
    this.#loader = new Loader(pageElement, template());
    if (this.#video) {
      pageElement.innerHTML = template();
      const videoPage = document.getElementById(
        'video-page-container',
      ) as HTMLElement;
      const video = new VideoPlayer(videoPage, this.#video);
      video.render();
    } else {
      this.#loader.render();
    }
  }
}

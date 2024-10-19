import template from './RoomPage.hbs';
import { Movie } from 'types/movie';
import { roomPageStore } from '@store/RoomPageStore';
import { movie } from '../../consts';
import { Loader } from '../../components/Loader/Loader';
import { VideoPlayer } from 'components/VideoPlayer/VideoPlayer';

export class RoomPage {
  #movie!: any; // TODO: поменять на тип фильма
  #loader!: Loader;

  constructor() {}

  render() {
    // this.#movieSelections = mainPageStore.getSelections();
    this.renderTemplate();
  }

  renderTemplate() {
    const rootElem = document.getElementById('root');
    if (rootElem) {
      rootElem.classList.add('root-black');
      rootElem.classList.remove('root-image');
    }
    const pageElement = document.getElementsByTagName('main')[0];
    pageElement.innerHTML = template({ movie });
    const videoContainer = document.getElementById('room-video') as HTMLElement;
    const video = new VideoPlayer(videoContainer, movie.video);
    video.render();

    // this.#loader = new Loader(pageElement, template());
    // if (this.#movieSelections.length) {
    //   pageElement.innerHTML = template();
    // } else {
    //   this.#loader.render();
    // }
  }
}

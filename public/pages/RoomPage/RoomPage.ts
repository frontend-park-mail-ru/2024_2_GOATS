import template from './RoomPage.hbs';
import { roomPageStore } from 'store/RoomPageStore';
// import { movie } from '../../consts';
import { Loader } from '../../components/Loader/Loader';
import { VideoPlayer } from 'components/VideoPlayer/VideoPlayer';
import { Actions } from 'flux/Actions';
import { Room } from 'types/room';

export class RoomPage {
  #movie!: any; // TODO: поменять на тип фильма
  #room!: Room;
  #loader!: Loader;

  constructor() {}

  render() {
    this.#room = roomPageStore.getRoom();
    console.log('ROOM FROM ROOM PAGE', this.#room);
    this.renderTemplate();
  }

  onPauseClick() {
    Actions.sendActionMessage({
      name: 'pause',
    });
  }

  renderTemplate() {
    const rootElem = document.getElementById('root');
    if (rootElem) {
      rootElem.classList.add('root-black');
      rootElem.classList.remove('root-image');
    }
    const pageElement = document.getElementsByTagName('main')[0];
    this.#loader = new Loader(pageElement, template());
    if (this.#room) {
      pageElement.innerHTML = template({ movie: this.#room.movie });

      const videoContainer = document.getElementById(
        'room-video',
      ) as HTMLElement;
      const video = new VideoPlayer(
        videoContainer,
        this.#room.movie.video,
        undefined,
        this.onPauseClick,
      );
      video.render();
    } else {
      this.#loader.render();
    }
    // pageElement.innerHTML = template({ movie });
  }
}

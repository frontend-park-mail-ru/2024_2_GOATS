import template from './RoomPage.hbs';
import { roomPageStore } from 'store/RoomPageStore';
import { Loader } from '../../components/Loader/Loader';
import { VideoPlayer } from 'components/VideoPlayer/VideoPlayer';
import { Actions } from 'flux/Actions';
import { Room } from 'types/room';
import { UserNew } from 'types/user';
import { Notifier } from 'components/Notifier/Notifier';
import { ConfirmModal } from 'components/ConfirmModal/ConfirmModal';
import { Message } from 'components/Message/Message';
import { mockUsers } from '../../consts';
import { UsersList } from 'components/UsersList/UsersList';

export class RoomPage {
  #room!: Room;
  #loader!: Loader;
  #video!: VideoPlayer;
  #notifier!: Notifier;

  constructor() {}

  ngOnDestroy(): void {}

  render() {
    this.#room = roomPageStore.getRoom();

    this.renderTemplate();
  }

  onPauseClick(timeCode: number) {
    Actions.sendActionMessage({
      name: 'pause',
      time_code: timeCode,
    });
  }

  handleRewindVideo(timeCode: number) {
    Actions.sendActionMessage({
      name: 'rewind',
      time_code: timeCode,
    });
  }

  hanldeTimerTick(timeCode: number) {
    Actions.sendActionMessage({
      name: 'timer',
      time_code: timeCode,
    });
  }

  onPlayClick(timeCode: number) {
    Actions.sendActionMessage({
      name: 'play',
      time_code: timeCode,
    });
  }

  videoPlay(timeCode: number) {
    // TODO: согласовать, зачем нужен timeCode
    console.log('TIMECODE FROM VIDEO PLAY HANDLER', timeCode);
    this.#video.videoPlay();
  }

  videoPause(timeCode: number) {
    this.#video.videoPause(timeCode);
  }

  videoRewind(timeCode: number) {
    this.#video.videoRewind(timeCode);
  }

  onInviteButtonClick() {
    const currentUrl = window.location.href;

    navigator.clipboard.writeText(currentUrl).then(() => {
      this.#notifier.render();
    });
  }

  renderMessage(messageValue: string) {
    const messagesContainer = document.querySelector(
      '.room-page__chat_messages',
    ) as HTMLDivElement;
    const message = new Message(messagesContainer, mockUsers[0], messageValue);
    message.render();
  }

  renderUsersList(users: UserNew[]) {
    const usersListContainer = document.getElementById(
      'room-page-members-list',
    ) as HTMLDivElement;
    const usersList = new UsersList(usersListContainer, users);
    usersList.render();
  }

  sendMessage() {
    const messageValue = (<HTMLInputElement>(
      document.getElementById('messages-input')
    )).value;

    if (messageValue) {
      this.renderMessage(messageValue);
      Actions.sendActionMessage({
        name: 'message',
        message: messageValue,
      });
    }
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
      pageElement.innerHTML = template({
        movie: this.#room.movie,
      });

      const videoContainer = document.getElementById(
        'room-video',
      ) as HTMLElement;
      this.#video = new VideoPlayer({
        parent: videoContainer,
        url: this.#room.movie.video,
        hasNextSeries: true,
        hasPrevSeries: true,
        onPlayClick: this.onPlayClick,
        onPauseClick: this.onPauseClick,
        handleRewindVideo: this.handleRewindVideo,
        hanldeIntervalTick: this.hanldeTimerTick,
      });
      this.#video.render();

      // Для установки текущего тайм кода новому пользователю
      this.videoRewind(this.#room.time_code);
      // this.handleRewindVideo(this.#room.time_code);

      const invitationBtn = document.getElementById(
        'invitation-btn',
      ) as HTMLButtonElement;

      invitationBtn.addEventListener('click', () => this.onInviteButtonClick());

      this.#notifier = new Notifier(
        'success',
        'Ссылка для приглашения скопирована',
        3000,
      );

      const modal = new ConfirmModal(
        'Присоединиться к комнате совместного просмотра',
        () => {},
      );
      modal.render();

      // TEST MESSAGES
      const sendMessageButton = document.getElementById(
        'send-message-button',
      ) as HTMLButtonElement;
      sendMessageButton.addEventListener('click', () => this.sendMessage());
    } else {
      this.#loader.render();
    }
  }
}

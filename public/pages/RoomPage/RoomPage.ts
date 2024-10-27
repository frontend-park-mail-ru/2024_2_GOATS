import template from './RoomPage.hbs';
import { roomPageStore } from 'store/RoomPageStore';
// import { movie } from '../../consts';
import { Loader } from '../../components/Loader/Loader';
import { VideoPlayer } from 'components/VideoPlayer/VideoPlayer';
import { Actions } from 'flux/Actions';
import { Room } from 'types/room';
import { UserNew } from 'types/user';
import { Notifier } from 'components/Notifier/Notifier';
import { ConfirmModal } from 'components/ConfirmModal/ConfirmModal';
import { Message } from 'components/Message/Message';
import { mockUsers } from '../../consts';

export class RoomPage {
  #room!: Room;
  #members: UserNew[] = [
    {
      id: 1,
      email: 'user1@example.com',
      username: 'user1',
      avatar_url:
        'https://media.tproger.ru/uploads/2023/03/403019_avatar_male_man_person_user_icon.png',
      isAdmin: true,
    },
    {
      id: 2,
      email: 'user2@example.com',
      username: 'user2',
      avatar_url:
        'https://media.tproger.ru/uploads/2023/03/403019_avatar_male_man_person_user_icon.png',
    },
    {
      id: 3,
      email: 'user3@example.com',
      username: 'user3',
      avatar_url:
        'https://media.tproger.ru/uploads/2023/03/403019_avatar_male_man_person_user_icon.png',
    },
    {
      id: 4,
      email: 'user4@example.com',
      username: 'user4',
      avatar_url:
        'https://media.tproger.ru/uploads/2023/03/403019_avatar_male_man_person_user_icon.png',
    },
    {
      id: 5,
      email: 'user5@example.com',
      username: 'user5',
      avatar_url:
        'https://media.tproger.ru/uploads/2023/03/403019_avatar_male_man_person_user_icon.png',
    },
    {
      id: 6,
      email: 'user6@example.com',
      username: 'user6',
      avatar_url:
        'https://media.tproger.ru/uploads/2023/03/403019_avatar_male_man_person_user_icon.png',
    },
  ];

  #loader!: Loader;
  #video!: VideoPlayer;
  #notifier!: Notifier;

  constructor() {}

  render() {
    this.#room = roomPageStore.getRoom();

    // console.log('ROOM FROM ROOM PAGE', this.#room);
    this.renderTemplate();
  }

  onPauseClick(timeCode: number) {
    // console.log('timecode from hander', timeCode);
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
    console.log('TIMECODE WHILE TICK', timeCode);
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
    console.log(messagesContainer);
    const message = new Message(messagesContainer, mockUsers[0], messageValue);
    message.render();
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
        members: this.#members,
      });
      console.log(this.#members);

      const videoContainer = document.getElementById(
        'room-video',
      ) as HTMLElement;
      this.#video = new VideoPlayer(
        videoContainer,
        this.#room.movie.video,
        undefined,
        this.onPlayClick,
        this.onPauseClick,
        this.handleRewindVideo,
        this.hanldeTimerTick,
      );
      this.#video.render();

      this.handleRewindVideo(this.#room.time_code);

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
        'Присоедениться к комнате совместного просмотра',
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

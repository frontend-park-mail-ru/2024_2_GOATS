import template from './RoomPage.hbs';
import { roomPageStore } from 'store/RoomPageStore';
import { Loader } from '../../components/Loader/Loader';
import { VideoPlayer } from 'components/VideoPlayer/VideoPlayer';
import { Actions } from 'flux/Actions';
import { MessageData, Room } from 'types/room';
import { UserNew } from 'types/user';
import { Notifier } from 'components/Notifier/Notifier';
import { ConfirmModal } from 'components/ConfirmModal/ConfirmModal';
import { Message } from 'components/Message/Message';
import { UsersList } from 'components/UsersList/UsersList';
import { userStore } from 'store/UserStore';
import { router } from 'modules/Router';
import { CreateRoomModal } from 'components/CreateRoomModal/CreateRoomModal';
import { Season } from 'types/movie';

export class RoomPage {
  #room!: Room;
  #loader!: Loader;
  #video!: VideoPlayer;
  #notifier!: Notifier;
  #isModalConfirm!: boolean;

  constructor() {}

  ngOnDestroy(): void {}

  render() {
    this.#room = roomPageStore.getRoom();
    this.#isModalConfirm = roomPageStore.getIsModalConfirm();

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
    Actions.sendActionMessage({
      name: 'duration',
      duration: this.getVideoDuration(),
    });
  }

  handleChageSeries(season: number, series: number) {
    Actions.sendActionMessage({
      name: 'change_series',
      season_number: season,
      episode_number: series,
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

  renderMessage(message: MessageData, isCurrentUser: boolean = false) {
    const messagesContainer = document.querySelector(
      '.room-page__chat_messages',
    ) as HTMLDivElement;

    const messageElement = new Message({
      parent: messagesContainer,
      message,
      isCurrentUser,
    });

    let isEndOfChat = false;

    if (
      !isCurrentUser &&
      messagesContainer.scrollTop + messagesContainer.clientHeight ===
        messagesContainer.scrollHeight
    ) {
      isEndOfChat = true;
    }

    messageElement.render();

    if (isEndOfChat) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
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
      const messagesContainer = document.querySelector(
        '.room-page__chat_messages',
      ) as HTMLDivElement;

      const message = {
        sender: userStore.getUser().username,
        avatar: userStore.getUser().avatar,
        text: messageValue,
      };
      this.renderMessage(message, true);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;

      Actions.sendActionMessage({
        name: 'message',
        message,
      });

      const messageInput = document.getElementById(
        'messages-input',
      ) as HTMLInputElement;
      messageInput.value = '';
    }
  }

  getCurrentVideoTime() {
    return this.#video.getCurrentVideoTime();
  }

  getVideoDuration() {
    return this.#video.getVideoDuration();
  }

  setVideoTime(timeCode: number) {
    this.#video.setVideoTime(timeCode);
  }

  handleChangeMovieClick() {
    const modal = new CreateRoomModal((id: number) => Actions.changeMovie(id));
    const createRoomButton = document.getElementById(
      'change-movie-btn',
    ) as HTMLElement;

    if (createRoomButton) {
      createRoomButton.addEventListener('click', () => {
        modal.render();
      });
    }
  }

  renderVideo(
    videoUrl?: string,
    titleImage?: string,
    seasons?: Season[],
    currentSeason?: number,
    currentSeries?: number,
  ) {
    console.log('RENDER VIDEO', videoUrl, titleImage);
    // TODO: Добавить обработку серий и сезонов при первой загрузке страницы
    const videoContainer = document.getElementById('room-video') as HTMLElement;
    this.#video = new VideoPlayer({
      parent: videoContainer,
      ...(videoUrl ? { videoUrl } : { videoUrl: this.#room.movie.video }),
      ...(titleImage
        ? { titleImage }
        : { titleImage: this.#room.movie.titleImage }),
      ...(seasons &&
        seasons.length && {
          seasons,
          ...(!currentSeason
            ? { currentSeason: 1, currentSeries: 1 }
            : { currentSeason, currentSeries }),
          onVideoUpdate: this.onVideoUpdate.bind(this),
        }),
      onPlayClick: this.onPlayClick,
      onPauseClick: this.onPauseClick,
      handleRewindVideo: this.handleRewindVideo,
    });
    this.#video.render();
  }

  changeMovieInfo(titleImage: string, shortDescription: string) {
    const titleBlock = document.querySelector(
      '.room-page__info_description_title',
    ) as HTMLImageElement;
    const descriptionBlock = document.querySelector(
      '.room-page__info_description_text',
    ) as HTMLParagraphElement;

    titleBlock.src = titleImage;
    descriptionBlock.textContent = shortDescription;
  }

  onSeriesClick(seriesNumber: number) {
    this.#room.currentSeries = seriesNumber;

    if (
      this.#room.movie?.seasons &&
      this.#room.movie?.seasons.length &&
      this.#room.currentSeason
    ) {
      this.renderVideo(
        this.#room.movie?.seasons[this.#room.currentSeason - 1].episodes[
          seriesNumber - 1
        ].video,
        this.#room.movie.titleImage,
        this.#room.movie.seasons,
      );
    }
  }

  onVideoUpdate(
    videoUrl: string,
    currentSeason: number,
    currentSeries: number,
  ) {
    this.#room.currentSeason = currentSeason;
    this.#room.currentSeries = currentSeries;

    this.onPauseClick(0);
    this.handleChageSeries(currentSeason, currentSeries);
    this.renderVideo(
      videoUrl,
      this.#room.movie.titleImage,
      this.#room.movie.seasons,
      currentSeason,
      currentSeries,
    );
  }

  renderTemplate() {
    const rootElem = document.getElementById('root');
    if (rootElem) {
      rootElem.classList.add('root-black');
      rootElem.classList.remove('root-image');
    }
    const pageElement = document.getElementsByTagName('main')[0];
    this.#loader = new Loader(pageElement, template());

    if (!userStore.getUser().username) {
      Actions.setGlobalRoomId(roomPageStore.getRoomIdFromUrl());
      const notifier = new Notifier(
        'error',
        'Сначала необходимо войти в аккаунт',
        3000,
      );
      notifier.render();
      router.go('/auth');
    } else if (!this.#isModalConfirm) {
      pageElement.innerHTML = '';
      const modal = new ConfirmModal(
        'Присоединиться к комнате совместного просмотра',
        false,
        () => {
          roomPageStore.setIsModalConfirm(true);
        },
        () => {
          router.go('/');
          Actions.setGlobalRoomId('');
        },
      );
      modal.render();
    } else {
      if (this.#room) {
        pageElement.innerHTML = template({
          movie: this.#room.movie,
        });

        if (
          this.#room.movie.isSerial &&
          this.#room.movie.seasons &&
          this.#room.currentSeason &&
          this.#room.currentSeries
        ) {
          this.renderVideo(
            this.#room.movie.seasons[this.#room.currentSeason - 1].episodes[
              this.#room.currentSeries - 1
            ].video,
          );
        } else {
          this.renderVideo();
        }

        // Для установки текущего тайм кода новому пользователю
        this.videoRewind(this.#room.timeCode);

        if (this.#room.status === 'playing') {
          this.videoPlay(this.#room.timeCode);
        }

        const invitationBtn = document.getElementById(
          'invitation-btn',
        ) as HTMLButtonElement;

        invitationBtn.addEventListener('click', () =>
          this.onInviteButtonClick(),
        );

        this.#notifier = new Notifier(
          'success',
          'Ссылка для приглашения скопирована',
          3000,
        );

        const sendMessageButton = document.getElementById(
          'send-message-button',
        ) as HTMLButtonElement;
        sendMessageButton.addEventListener('click', () => this.sendMessage());
        this.handleChangeMovieClick();
      } else {
        this.#loader.render();
      }
    }
  }
}

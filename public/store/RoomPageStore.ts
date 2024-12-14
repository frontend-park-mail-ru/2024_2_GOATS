import { dispatcher } from 'flux/Dispatcher';
import { Actions } from 'flux/Actions';
import { ActionTypes } from 'flux/ActionTypes';
import { RoomPage } from 'pages/RoomPage/RoomPage';
import { Action, Room } from 'types/room';
import { userStore } from './UserStore';
import { User } from 'types/user';
import { apiClient } from 'modules/ApiClient';
import { router } from 'modules/Router';
import { Emitter } from 'modules/Emmiter';
import { serializeRoom, serializeMovieDetailed } from 'modules/Serializer';

const roomPage = new RoomPage();

class RoomPageStore {
  #room!: Room | null;
  #ws: WebSocket | null = null;
  #user!: User;
  #createdRoomId = '';
  #roomIdFromUrl = '';
  #isModalConfirm = false;
  #isCreatedRoomReceived; // Емиттер для получения айди комнаты после создания
  #globalRoomId = '';

  constructor() {
    this.#isCreatedRoomReceived = new Emitter<boolean>(false);

    const unsubscribe = userStore.isUserAuthEmmiter$.addListener((status) => {
      if (
        this.#isModalConfirm &&
        status &&
        router.getCurrentPath() === `/room/${this.#roomIdFromUrl}` &&
        !this.#ws
      ) {
        this.wsInit();
      }

      if (
        !this.#isModalConfirm &&
        router.getCurrentPath() === `/room/${this.#roomIdFromUrl}`
      ) {
        roomPage.render();
      }
    });

    this.ngOnDestroy = () => {
      unsubscribe();
    };

    dispatcher.register(this.reduce.bind(this));
  }

  ngOnDestroy(): void {}

  get isCreatedRoomReceived$(): Emitter<boolean> {
    return this.#isCreatedRoomReceived;
  }

  setState(room: Room) {
    this.#room = room;
  }

  setIsModalConfirm(isModalConfirm: boolean) {
    this.#isModalConfirm = isModalConfirm;
    roomPage.render();
    if (
      !this.#ws &&
      userStore.getUser().username &&
      !this.#createdRoomId &&
      isModalConfirm
    ) {
      this.wsInit();
    }
  }

  getWs() {
    return this.#ws;
  }

  getRoom() {
    return this.#room;
  }

  getCreatedRoomId() {
    return this.#createdRoomId;
  }

  getIsModalConfirm() {
    return this.#isModalConfirm;
  }

  getRoomIdFromUrl() {
    return this.#roomIdFromUrl;
  }

  getGlobalRoomId() {
    return this.#globalRoomId;
  }

  async createRoom(movieId: number) {
    try {
      this.#isCreatedRoomReceived.set(false);
      const response = await apiClient.post({
        path: 'room/create',
        body: {
          movie: {
            id: movieId,
          },
        },
      });

      this.#createdRoomId = response.id;
      this.#isCreatedRoomReceived.set(true);
    } catch (e: any) {
      throw e;
    }
  }

  wsInit() {
    this.#user = userStore.getUser();
    const ws = new WebSocket(
      `ws://localhost:8080/api/room/join?room_id=${this.#roomIdFromUrl}&user_id=${this.#user.id}`,
    );

    this.#ws = ws;

    if (this.#globalRoomId) {
      this.#globalRoomId = '';
    }

    ws.onclose = (event) => {
      console.log('WebSocket соединение закрыто:', event.code, event.reason);
    };

    ws.onopen = () => {
      console.log('WebSocket соединение открыто');
    };

    ws.onmessage = (event) => {
      const messageData = JSON.parse(event.data);
      if ((messageData.movie && messageData.movie.id) || messageData.id) {
        // console.log('RECEIVED ROOM DATA', messageData);
        // messageData.movie.video_url =
        //   '/static/movies_all/how-you-see-me/movie.mp4';
        this.setState(serializeRoom(messageData));
        roomPage.render();
      } else if (Array.isArray(messageData)) {
        roomPage.renderUsersList(messageData);
      } else if (messageData.timeCode) {
        if (messageData.timeCode - roomPage.getCurrentVideoTime() > 2) {
          roomPage.setVideoTime(messageData.timeCode);
        }
      } else {
        switch (messageData.name) {
          case 'play':
            roomPage.videoPlay(messageData.time_code);
            break;
          case 'pause':
            roomPage.videoPause(messageData.time_code);
            break;
          case 'rewind':
            roomPage.videoRewind(messageData.time_code);
            break;
          case 'message':
            roomPage.renderMessage(messageData.message);
            break;
          default:
            // TODO: проверить на новом формате прихода измененного фильма
            // console.log('serialized movie', this.#room.movie);

            console.log('MSG DATA', messageData);
            if (
              this.#room &&
              messageData['movie '] &&
              messageData['movie '].id !== this.#room.movie.id
            ) {
              // messageData['movie '].video_url =
              //   '/static/movies_all/avatar/movie.mp4';
              this.#room.movie = serializeMovieDetailed(messageData['movie ']);
              if (this.#room.movie.seasons && this.#room.movie.seasons.length) {
                roomPage.renderVideo(
                  this.#room.movie.seasons[0].episodes[0].video,
                  this.#room.movie.titleImage,
                  this.#room.movie.seasons,
                );
              } else {
                roomPage.renderVideo(
                  this.#room.movie.video,
                  this.#room.movie.titleImage,
                  this.#room.movie.seasons,
                );
              }
              roomPage.changeMovieInfo(
                this.#room.movie.titleImage,
                this.#room.movie.shortDescription,
              );
            }
        }
      }
    };
  }

  sendActionMessage(actionMessage: Action) {
    if (this.#ws) {
      this.#ws.send(JSON.stringify(actionMessage));
    }
  }

  closeWs() {
    if (this.#ws) {
      this.#ws.close();
      this.#ws = null;
      this.#isModalConfirm = false;
      this.#createdRoomId = '';
      this.#roomIdFromUrl = '';
      this.#room = null;
    }
  }

  async reduce(action: any) {
    switch (action.type) {
      case ActionTypes.RENDER_ROOM_PAGE:
        this.#roomIdFromUrl = action.payload;
        if (this.#createdRoomId && !this.#ws && this.#isModalConfirm) {
          this.wsInit();
        }
        // roomPage.render();
        break;
      case ActionTypes.CREATE_ROOM:
        await this.createRoom(action.movieId);
        break;
      case ActionTypes.SEND_ACTION_MESSAGE:
        this.sendActionMessage(action.actionData);
        console.log('SEND ACTIONS', action.actionData);
        break;
      case ActionTypes.SET_GLOBAL_ROOM_ID:
        this.#globalRoomId = action.id;
        break;
      case ActionTypes.CHANGE_MOVIE:
        if (this.#room && action.id !== this.#room.movie.id) {
          roomPage.videoPause(0);

          this.sendActionMessage({
            name: 'change',
            movie_id: action.id,
            time_code: 0,
          });

          this.sendActionMessage({
            name: 'pause',
            time_code: 0,
          });
        }
        break;
      default:
        break;
    }
  }
}

export const roomPageStore = new RoomPageStore();

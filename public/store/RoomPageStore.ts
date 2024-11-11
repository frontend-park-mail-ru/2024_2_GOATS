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
import { serializeRoom } from 'modules/Serializer';

const roomPage = new RoomPage();

class RoomPageStore {
  #room!: Room;
  #ws: WebSocket | null = null;
  #user!: User;
  #createdRoomId = '';
  #roomIdFromUrl = '';
  #isModalConfirm = false;
  #isCreatedRoomReceived; // Емиттер для получения айди комнаты после создания

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
    if (!this.#ws && userStore.getUser().username) {
      this.wsInit();
    }
  }

  getWs() {
    return this.#ws;
  }

  getRoom() {
    console.log('room from store', this.#room);
    return this.#room;
  }

  getCreatedRoomId() {
    return this.#createdRoomId;
  }

  getIsModalConfirm() {
    return this.#isModalConfirm;
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
      this.#isModalConfirm = true;
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

    ws.onclose = (event) => {
      console.log('WebSocket соединение закрыто:', event.code, event.reason);
    };

    ws.onopen = () => {
      console.log('WebSocket соединение открыто');
    };

    ws.onmessage = (event) => {
      const messageData = JSON.parse(event.data);

      if (messageData.movie) {
        // TODO: Убрать тестовый сценарий после мержа на бэке:
        messageData.movie.title_url = '/static/movies/squid-game/logo.png';
        messageData.movie.video_url = '/static/movies/squid-game/movie.mp4';

        this.setState(serializeRoom(messageData));

        roomPage.render();
      } else if (Array.isArray(messageData)) {
        roomPage.renderUsersList(messageData);
      } else {
        switch (messageData.name) {
          case 'play':
            roomPage.videoPlay(messageData.time_code);
            break;
          case 'pause':
            console.log('PAUSE');
            roomPage.videoPause(messageData.time_code);
            break;
          case 'rewind':
            roomPage.videoRewind(messageData.time_code);
            break;
          case 'message':
            roomPage.renderMessage(messageData.message);
            break;
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
    }
  }

  async reduce(action: any) {
    switch (action.type) {
      case ActionTypes.RENDER_ROOM_PAGE:
        this.#roomIdFromUrl = action.payload;
        roomPage.render();
        break;
      case ActionTypes.CREATE_ROOM:
        await this.createRoom(action.movieId);
        break;
      case ActionTypes.CONNECT_TO_ROOM:
        console.log('connect');
        break;
      case ActionTypes.SEND_ACTION_MESSAGE:
        this.sendActionMessage(action.actionData);
        break;
      default:
        break;
    }
  }
}

export const roomPageStore = new RoomPageStore();

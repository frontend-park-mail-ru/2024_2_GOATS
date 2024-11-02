import { dispatcher } from 'flux/Dispatcher';
import { Actions } from 'flux/Actions';
import { ActionTypes } from 'flux/ActionTypes';
import { RoomPage } from 'pages/RoomPage/RoomPage';
import { Action, Room } from 'types/room';
import { userStore } from './UserStore';
import { User } from 'types/user';
import { apiClient } from 'modules/ApiClient';
import { mockUsers } from '../consts';
import { router } from 'modules/Router';
import { Emitter } from 'modules/Emmiter';

const roomPage = new RoomPage();

class RoomPageStore {
  #room!: Room;
  #ws: WebSocket | null = null;
  #user!: User;
  #createdRoomId = '';
  #roomIdFromUrl = '';
  #isCreatedRoomReceived; // Емиттер для получения айди комнаты после создания комнаты

  constructor() {
    this.#isCreatedRoomReceived = new Emitter<boolean>(false);

    const unsubscribe = userStore.isUserAuthEmmiter$.addListener((status) => {
      if (
        status &&
        router.getCurrentPath() === `/room/${this.#roomIdFromUrl}`
      ) {
        Actions.renderRoomPage(this.#roomIdFromUrl);
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

  getRoom() {
    return this.#room;
  }

  getCreatedRoomId() {
    return this.#createdRoomId;
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

    ws.onclose = (event) => {
      console.log('WebSocket соединение закрыто:', event.code, event.reason);
    };

    ws.onopen = () => {
      console.log('WebSocket соединение открыто');
    };

    ws.onmessage = (event) => {
      const messageData = JSON.parse(event.data);

      if (messageData.movie) {
        messageData.movie.video =
          'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
        this.setState(messageData);
        roomPage.render();
      } else if (messageData.action.name) {
        switch (messageData.action.name) {
          case 'play':
            roomPage.videoPlay(messageData.action.time_code);
            break;
          case 'pause':
            roomPage.videoPause(messageData.action.time_code);
            break;
          case 'rewind':
            roomPage.videoRewind(messageData.action.time_code);
            break;
          case 'message':
            roomPage.renderMessage(messageData.action.message);
        }
      }
    };
    this.#ws = ws;
  }

  sendActionMessage(actionMessage: Action) {
    if (this.#ws) {
      this.#ws.send(JSON.stringify(actionMessage));
    }
  }

  async reduce(action: any) {
    switch (action.type) {
      case ActionTypes.RENDER_ROOM_PAGE:
        roomPage.render();

        this.#roomIdFromUrl = action.payload;
        if (this.#isCreatedRoomReceived.get()) {
          this.wsInit();
        }
        break;
      case ActionTypes.CREATE_ROOM:
        await this.createRoom(action.movieId);
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

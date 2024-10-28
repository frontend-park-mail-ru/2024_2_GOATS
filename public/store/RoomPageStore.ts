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

const roomPage = new RoomPage();

class RoomPageStore {
  #room!: Room;
  #ws: WebSocket | null = null;
  #user!: User;

  constructor() {
    dispatcher.register(this.reduce.bind(this));
    const unsubscribe = userStore.isUserAuthEmmiter$.addListener((status) => {
      if (status && router.getCurrentPath() === '/room') {
        // roomPage.render();
        Actions.renderRoomPage();
        this.wsInit();
      }
    });

    this.ngOnDestroy = () => {
      unsubscribe();
    };
  }

  ngOnDestroy(): void {}

  setState(room: Room) {
    this.#room = room;
  }

  getRoom() {
    return this.#room;
  }

  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  createRoom(movieId: number) {
    try {
      apiClient.post({
        path: 'room/create',
        body: {
          movie: {
            id: movieId,
          },
        },
      });
    } catch (e: any) {
      throw e;
    }
  }
  wsInit() {
    console.log('CURRENT USER IN ROOM PAGE STORE', userStore.getUser());
    this.#user = userStore.getUser();
    // this.#user = mockUsers[this.getRandomInt(0, 1)];
    // console.log(this.#user);
    const ws = new WebSocket(
      `ws://localhost:8080/api/room/join?room_id=b6f7c492-b552-4187-8607-4727ea9c6bca&user_id=${this.#user.id}`,
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
      } else {
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
        // console.log('Received ACTION message:', messageData);
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
        // this.#user = userStore.getUser();
        roomPage.render();
        // if (this.#user.id > 0) {
        // this.wsInit();
        // }
        break;
      case ActionTypes.CREATE_ROOM:
        this.createRoom(action.movieId);
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

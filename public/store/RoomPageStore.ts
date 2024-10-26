import { dispatcher } from 'flux/Dispatcher';
import { ActionTypes } from 'flux/ActionTypes';
import { RoomPage } from 'pages/RoomPage/RoomPage';
import { Action, Room } from 'types/room';
import { userStore } from './UserStore';
import { User } from 'types/user';
import { apiClient } from 'modules/ApiClient';

const roomPage = new RoomPage();

class RoomPageStore {
  #room!: Room;
  #ws: WebSocket | null = null;
  #user!: User;

  constructor() {
    dispatcher.register(this.reduce.bind(this));
  }

  setState(room: Room) {
    this.#room = room;
  }

  getRoom() {
    return this.#room;
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
      console.log(e);
    }
  }

  wsInit() {
    const ws = new WebSocket(
      `ws://localhost:8080/api/room/join?room_id=8a225776-ec7d-4b86-8bd0-6b10af01bc9c`,
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
        this.setState(messageData);
        roomPage.render();
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
        }
        console.log('Received ACTION message:', messageData);
      }
    };
    this.#ws = ws;
  }

  sendActionMessage(actionMessage: Action) {
    console.log('sendedAction', actionMessage);
    if (this.#ws) {
      console.log('SENDED DATA', actionMessage);
      this.#ws.send(JSON.stringify(actionMessage));
    }
  }

  async reduce(action: any) {
    switch (action.type) {
      case ActionTypes.RENDER_ROOM_PAGE:
        roomPage.render();
        this.wsInit();
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

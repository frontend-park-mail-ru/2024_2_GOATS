import { dispatcher } from 'flux/Dispatcher';
import { ActionTypes } from 'flux/ActionTypes';
import { RoomPage } from 'pages/RoomPage/RoomPage';
import { Action, Room } from 'types/room';
import { userStore } from './UserStore';
import { User } from 'types/user';

const roomPage = new RoomPage();

const users = [
  {
    email: 'user1@example.com',
    username: 'user1',
    isAuth: true,
  },
  {
    email: 'user2@example.com',
    username: 'user2',
    isAuth: false,
  },
  {
    email: 'user3@example.com',
    username: 'user3',
    isAuth: true,
  },
  {
    email: 'user4@example.com',
    username: 'user4',
    isAuth: false,
  },
  {
    email: 'user5@example.com',
    username: 'user5',
    isAuth: true,
  },
  {
    email: 'user6@example.com',
    username: 'user6',
    isAuth: false,
  },
  {
    email: 'user7@example.com',
    username: 'user7',
    isAuth: true,
  },
  {
    email: 'user8@example.com',
    username: 'user8',
    isAuth: false,
  },
  {
    email: 'user9@example.com',
    username: 'user9',
    isAuth: true,
  },
  {
    email: 'user10@example.com',
    username: 'user10',
    isAuth: false,
  },
];

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

  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // wsInit() {
  //   this.#user = users[this.getRandomInt(1, 10)];
  //   const ws = new WebSocket(
  //     `ws://localhost:8000?username=${this.#user.username}`,
  //   );

  //   ws.onclose = (event) => {
  //     console.log('WebSocket соединение закрыто:', event.code, event.reason);
  //   };

  //   ws.onopen = () => {
  //     console.log('WebSocket соединение открыто');
  //   };

  //   ws.onmessage = (event) => {
  //     const messageData = JSON.parse(event.data);

  //     if (messageData.type === 'ROOM') {
  //       this.setState(messageData.data);
  //       // console.log('RERENDER ROOM PAGE', this.#room);
  //       roomPage.render();
  //     } else if (messageData.type === 'ACTION') {
  //       switch (messageData.data.name) {
  //         case 'play':
  //           roomPage.videoPlay();
  //           break;
  //         case 'pause':
  //           roomPage.videoPause(messageData.data.timeCode);
  //           break;
  //         case 'rewind':
  //           roomPage.videoRewind(messageData.data.timeCode);
  //           break;
  //       }
  //       console.log('Received ACTION message:', messageData);
  //     }
  //     // console.log('REC DATA FROM WS', messageData);
  //   };
  //   this.#ws = ws;
  // }

  sendActionMessage(actionMessage: Action) {
    console.log('sendedAction', actionMessage);
    if (this.#ws) {
      const actionData = {
        username: this.#user.username,
        type: 'ACTION',
        data: actionMessage,
      };
      console.log('SENDED DATA', actionData);
      this.#ws.send(JSON.stringify(actionData));
    }
  }

  async reduce(action: any) {
    switch (action.type) {
      case ActionTypes.RENDER_ROOM_PAGE:
        roomPage.render();
        // this.wsInit();
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

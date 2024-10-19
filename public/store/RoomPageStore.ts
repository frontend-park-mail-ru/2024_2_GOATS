import { dispatcher } from 'flux/Dispatcher';
import { ActionTypes } from 'flux/ActionTypes';
import { RoomPage } from 'pages/RoomPage/RoomPage';
import { apiClient } from 'modules/ApiClient';
import { Action, Room } from 'types/room';
import { serializeCollections } from 'modules/Serializer';

const roomPage = new RoomPage();

class RoomPageStore {
  #room!: Room;
  #ws: WebSocket | null = null;

  constructor() {
    dispatcher.register(this.reduce.bind(this));
  }

  setState(room: Room) {
    this.#room = room;
  }

  getRoom() {
    return this.#room;
  }

  wsInit() {
    const ws = new WebSocket(`ws://localhost:8000?username=test_user`);
    ws.onclose = (event) => {
      console.log('WebSocket соединение закрыто:', event.code, event.reason);
    };

    ws.onopen = () => {
      console.log('WebSocket соединение открыто');
    };
    this.#ws = ws;
  }

  wsOnMessage() {
    if (this.#ws) {
      this.#ws.onmessage = (event) => {
        const messageData = JSON.parse(event.data);
        if ((messageData.type = 'ROOM')) {
          this.setState(messageData.data);
          console.log('RERENDER ROOM PAGE', this.#room);
          roomPage.render();
        }
        // console.log('REC DATA FROM WS', messageData);
      };
    }
  }

  sendActionMessage(actionMessage: Action) {
    console.log('sendedAction', actionMessage);
    if (this.#ws) {
      const actionData = {
        type: 'ACTION',
        data: actionMessage,
      };
      this.#ws.send(JSON.stringify(actionData));
    }
  }

  async reduce(action: any) {
    switch (action.type) {
      case ActionTypes.RENDER_ROOM_PAGE:
        roomPage.render();
        this.wsInit();
        this.wsOnMessage();
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

// async getCollection() {
//   const response = await apiClient.get({
//     path: 'movie_collections/',
//   });

//   const serializedSelections = serializeCollections(
//     response.collections,
//   ).sort((selection1: any, selection2: any) => selection1.id - selection2.id);

//   if (serializedSelections.length !== this.#movieSelections.length) {
//     this.setState(serializedSelections);
//     mainPage.render();
//   } else {
//     this.setState(serializedSelections);
//   }
// }

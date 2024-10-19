import { dispatcher } from 'flux/Dispatcher';
import { ActionTypes } from 'flux/ActionTypes';
import { RoomPage } from 'pages/RoomPage/RoomPage';
import { apiClient } from 'modules/ApiClient';
import { MovieSelection } from 'types/movie';
import { serializeCollections } from 'modules/Serializer';

const roomPage = new RoomPage();

class RoomPageStore {
  #movie: MovieSelection[] = [];

  constructor() {
    dispatcher.register(this.reduce.bind(this));
  }

  setState(movieSelections: MovieSelection[]) {
    this.#movie = movieSelections;
  }

  getSelections() {
    return this.#movie;
  }

  async reduce(action: any) {
    switch (action.type) {
      case ActionTypes.RENDER_ROOM_PAGE:
        roomPage.render();
        break;
      default:
        break;
    }
  }
}

export const roomPageStore = new RoomPageStore();

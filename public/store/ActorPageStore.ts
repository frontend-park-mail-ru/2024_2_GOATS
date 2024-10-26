import { ActionTypes } from 'flux/ActionTypes';
import { mockActor, movies } from '../consts';
import { Actor, ActorInfo } from 'types/actor';
import { ActorPage } from 'pages/ActorPage/ActorPage';
import { dispatcher } from 'flux/Dispatcher';
import { apiClient } from 'modules/ApiClient';
import { serializeActorData } from 'modules/Serializer';

export class ActorPageStore {
  #actor!: ActorInfo; //Actor - Игорь не включает фильмографию - исправит

  constructor() {
    // this.#actor = {};
    dispatcher.register(this.reduce.bind(this));
  }

  //Здесь надо будет привязываться к id из юрла
  // async getActorRequest() {
  //   this.#actor = mockActor;
  // }

  setState(actor: ActorInfo) {
    //Actor - Игорь не включает фильмографию - исправит
    this.#actor = actor;
  }

  getActor() {
    return this.#actor;
  }

  async renderActorPage(id: number | string) {
    const response = await apiClient.get({
      path: `actors/${id}`,
    });

    const serializedActorData = serializeActorData(response.actor_info);

    this.setState(serializedActorData);
    const actorPage = new ActorPage();
    actorPage.render();
  }

  async reduce(action: any) {
    switch (action.type) {
      case ActionTypes.RENDER_ACTOR_PAGE:
        // await this.renderActorPage();
        this.renderActorPage(action.payload);
        // mainPage.render();
        // await this.getCollection();
        break;
      default:
        break;
    }
  }
}

export const actorPageStore = new ActorPageStore();

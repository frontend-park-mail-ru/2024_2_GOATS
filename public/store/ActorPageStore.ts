import { ActionTypes } from 'flux/ActionTypes';
import { mockActor, movies } from '../consts';
import { Actor, ActorInfo } from 'types/actor';
import { ActorPage } from 'pages/ActorPage/ActorPage';
import { dispatcher } from 'flux/Dispatcher';
import { apiClient } from 'modules/ApiClient';
import { serializeActorData } from 'modules/Serializer';

export class ActorPageStore {
  #actor!: Actor;

  constructor() {
    dispatcher.register(this.reduce.bind(this));
  }

  setState(actor: Actor) {
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
        this.renderActorPage(action.payload);
        break;
      default:
        break;
    }
  }
}

export const actorPageStore = new ActorPageStore();

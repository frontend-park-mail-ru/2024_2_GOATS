import { ActionTypes } from 'flux/ActionTypes';
import { mockActor, movies } from '../consts';
import { Actor } from 'types/actor';
import { ActorPage } from 'pages/ActorPage/ActorPage';
import { dispatcher } from 'flux/Dispatcher';

export class ActorPageStore {
  #actor!: Actor;

  constructor() {
    // this.#actor = {};
    dispatcher.register(this.reduce.bind(this));
  }

  //Здесь надо будет привязываться к id из юрла
  async getActorRequest() {
    this.#actor = mockActor;
  }

  getActor() {
    return this.#actor;
  }

  renderActorPage(id: number | string) {
    console.log('ID АКТЕРА ', id);
    const actorPage = new ActorPage();
    actorPage.render();
  }

  async reduce(action: any) {
    switch (action.type) {
      case ActionTypes.RENDER_ACTOR_PAGE:
        await this.getActorRequest();
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

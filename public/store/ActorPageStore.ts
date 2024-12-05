import { ActionTypes } from 'flux/ActionTypes';
import { Actor } from 'types/actor';
import { ActorPage } from 'pages/ActorPage/ActorPage';
import { dispatcher } from 'flux/Dispatcher';
import { apiClient } from 'modules/ApiClient';
import { serializeActorData } from 'modules/Serializer';
import { ErrorPage } from 'pages/ErrorPage/ErrorPage';

const actorPage = new ActorPage();

export class ActorPageStore {
  #actor!: Actor | null;

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
    try {
      const response = await apiClient.get({
        path: `actors/${id}`,
      });

      const serializedActorData = serializeActorData(response.actor_info);

      this.setState(serializedActorData);
      actorPage.render();
    } catch (e: any) {
      const errorPage = new ErrorPage({
        errorTitle: '404. Страница не найдена',
        errorDescription:
          'Возможно, вы воспользовались недействительной ссылкой или страница была удалена. Проверьте URL-адрес или перейдите на главную страницу, там вас ожидают лучшие фильмы и сериалы.',
      });
      errorPage.render();
    }
  }

  async reduce(action: any) {
    switch (action.type) {
      case ActionTypes.RENDER_ACTOR_PAGE:
        this.#actor = null;
        actorPage.render();
        this.renderActorPage(action.payload);
        break;
      default:
        break;
    }
  }
}

export const actorPageStore = new ActorPageStore();

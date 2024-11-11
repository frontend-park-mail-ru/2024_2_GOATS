import { ActionTypes } from 'flux/ActionTypes';
import { mockActor, movies } from '../consts';
import { Actor, ActorInfo } from 'types/actor';
import { ActorPage } from 'pages/ActorPage/ActorPage';
import { dispatcher } from 'flux/Dispatcher';
import { apiClient } from 'modules/ApiClient';
import { serializeActorData } from 'modules/Serializer';
import { ErrorPage } from 'pages/ErrorPage/ErrorPage';

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
    try {
      const response = await apiClient.get({
        path: `actors/${id}`,
      });

      const serializedActorData = serializeActorData(response.actor_info);

      this.setState(serializedActorData);
      const actorPage = new ActorPage();
      actorPage.render();
    } catch (e: any) {
      const error = new ErrorPage({
        errorTitle: '404. Страница не найдена',
        errorDescription:
          'Возможно, вы воспользовались недействительной ссылкой или страница была удалена. Проверьте URL-адрес или перейдите на главную страницу, там вас ожидают лучшие фильмы и сериалы.',
      });
      error.render();
    }
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

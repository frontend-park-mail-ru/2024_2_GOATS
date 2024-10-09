import { routerHandler } from './RouterHandler';

class Router {
  start() {
    const url = new URL(window.location.href);
    routerHandler(url);
  }
}

export const router = new Router();

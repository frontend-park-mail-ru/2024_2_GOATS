import { routerHandler } from './RouterHandler';

class Router {
  start() {
    const url = new URL(window.location.href);
    routerHandler(url);

    window.onpopstate = (e) => {
      if (e.state) {
        routerHandler(new URL(window.location.href));
      } else {
        routerHandler(new URL(window.location.href));
      }
    };
  }

  go(path: string) {
    let url = new URL(path, window.location.href);
    routerHandler(url);
    window.history.pushState({}, path, path);
  }
}

export const router = new Router();

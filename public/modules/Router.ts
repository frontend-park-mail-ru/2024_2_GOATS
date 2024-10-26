import { routerHandler } from './RouterHandler';

class Router {
  getCurrentPath(): string {
    return window.location.pathname;
  }

  start() {
    const url = new URL(window.location.href);

    routerHandler(url, decodeURIComponent(this.parseUrl(url.pathname).id));

    window.onpopstate = (e) => {
      if (e.state) {
        routerHandler(new URL(window.location.href), e.state.id);
      } else {
        routerHandler(new URL(window.location.href));
      }
    };
  }

  go(path: string, id?: number | string) {
    let url = id
      ? new URL(`${path}/${id}`, window.location.href)
      : new URL(path, window.location.href);

    if (id) {
      routerHandler(url, id);
      window.history.pushState({ id }, path, `${path}/${id}`);
    } else {
      routerHandler(url);
      window.history.pushState({}, path, path);
    }
  }

  parseUrl(url: any) {
    let countSlash = 0;
    let method = '/';
    let id = '';
    for (let i in url) {
      if (url[i] === '/') {
        countSlash++;
      } else {
        if (countSlash === 1) {
          method += url[i];
        }
        if (countSlash === 2) {
          id += url[i];
        }
      }
    }
    return {
      method,
      id,
    };
  }
}

export const router = new Router();

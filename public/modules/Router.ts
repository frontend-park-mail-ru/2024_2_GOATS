import { routerHandler } from './RouterHandler';

class Router {
  start() {
    const url = new URL(window.location.href);
    // console.log(new URL('asa', window.location.href));
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
    console.log(url);
    routerHandler(url);
    window.history.pushState({}, path, path);

    // if (additionalUrl) {
    //   url = new URL(`${path}/${additionalUrl}`, window.location.href);
    // } else {
    //   url = new URL(path, window.location.href);
    // }

    // if (window.location.pathname === path && data !== 'logout' && url.searchParams.toString() === '') return;
    // if (parent) {
    //   parent.innerHTML = '';
    // }
    // if (data) {
    //   url.searchParams.append('id', data);
    // }

    // if (additionalUrl) {
    //   notifier(url, data, parent, additionalUrl);
    //   window.history.pushState({
    //     data,
    //     additionalUrl,
    //   }, path, `${path}/${additionalUrl}`);
    // } else {
    //   notifier(url, data, parent);
    //   window.history.pushState(data, path, path);
    // }
  }
}

export const router = new Router();

import { API_URL } from '../consts';

const HTTP_METHOD_GET = 'GET';
const HTTP_METHOD_POST = 'POST';
const noop = () => {};
class ApiClient {
  get({ path, callback }) {
    this._apiClient({
      method: HTTP_METHOD_GET,
      path,
      callback,
    });
  }

  post({ path, body, callback }) {
    this._apiClient({
      method: HTTP_METHOD_POST,
      path,
      body,
      callback,
    });
  }

  async _apiClient({ method, path, body = null, callback = noop }) {
    const response = await fetch(API_URL + path, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      ...(body && { body: JSON.stringify(body) }),
    });

    if (response.ok) {
      const jsonResponse = await response.json();
      callback(jsonResponse);
    }
  }
}

export const apiClient = new ApiClient();

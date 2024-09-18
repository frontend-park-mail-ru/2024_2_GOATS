import { API_URL } from '../consts';

const HTTP_METHOD_GET = 'GET';
const HTTP_METHOD_POST = 'POST';
const HTTP_METHOD_PUT = 'PUT';
const HTTP_METHOD_DELETE = 'DELETE';

const noop = () => {};

class ApiClient {
  get({ path, id, callback }) {
    this._apiClient({
      method: HTTP_METHOD_GET,
      path,
      id,
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

  put({ path, id, body, callback }) {
    this._apiClient({
      method: HTTP_METHOD_PUT,
      path,
      id,
      body,
      callback,
    });
  }

  delete({ path, id, callback }) {
    this._apiClient({
      method: HTTP_METHOD_DELETE,
      path,
      id,
      callback,
    });
  }

  async _apiClient({ method, path, id = null, body = null, callback = noop }) {
    const url = API_URL + path + (id ? `/${id}` : '');
    console.log(url);
    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      ...(body && { body: JSON.stringify(body) }),
    });

    // if (response.ok) {
    //   const jsonResponse = await response.json();
    //   callback(jsonResponse);
    // }

    if (!response.ok) {
      // Выбрасываем исключение с текстом ошибки или статусом
      const errorMessage = await response.text(); // Можно использовать response.json(), если сервер возвращает JSON-ошибку
      throw new Error(`Error ${response.status}: ${errorMessage}`);
    }

    // Если всё ок, парсим JSON и вызываем callback
    const jsonResponse = await response.json();
    callback(jsonResponse);
  }
}

export const apiClient = new ApiClient();

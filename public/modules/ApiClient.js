import { API_URL } from '../consts';

const HTTP_METHOD_GET = 'GET';
const HTTP_METHOD_POST = 'POST';
const HTTP_METHOD_PUT = 'PUT';
const HTTP_METHOD_DELETE = 'DELETE';

class ApiClient {
  get({ path, id }) {
    return this._apiClient({
      method: HTTP_METHOD_GET,
      path,
      id,
    });
  }

  post({ path, body }) {
    return this._apiClient({
      method: HTTP_METHOD_POST,
      path,
      body,
    });
  }

  put({ path, id, body }) {
    return this._apiClient({
      method: HTTP_METHOD_PUT,
      path,
      id,
      body,
    });
  }

  delete({ path, id }) {
    return this._apiClient({
      method: HTTP_METHOD_DELETE,
      path,
      id,
    });
  }

  async _apiClient({ method, path, id = null, body = null }) {
    const url = API_URL + path + (id ? `/${id}` : '');
    const response = await fetch(url, {
      method: method,
      headers: body ? { 'Content-Type': 'application/json' } : {},
      body: body && JSON.stringify(body),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Error ${response.status}: ${errorMessage}`);
    }

    const jsonResponse = await response.json();
    return jsonResponse;
  }
}

export const apiClient = new ApiClient();

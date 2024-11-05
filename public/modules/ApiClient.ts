import { API_URL } from '../consts';

const HTTP_METHOD_GET = 'GET';
const HTTP_METHOD_POST = 'POST';
const HTTP_METHOD_PUT = 'PUT';
const HTTP_METHOD_DELETE = 'DELETE';

type ApiClientRequests = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  id?: number;
  body?: Object;
  formData?: FormData;
};

type GetRequestParams = {
  path: string;
  id?: number;
};

type PostRequestParams = {
  path: string;
  body?: Object;
  formData?: FormData;
};

type PutReuqestParams = {
  path: string;
  id?: number;
  body?: Object;
  formData?: FormData;
};

type DeleteReuquestParams = {
  path: string;
  id?: number;
};

class ApiClient {
  get({ path, id }: GetRequestParams) {
    return this._apiClient({
      method: HTTP_METHOD_GET,
      path,
      ...(id && { id }),
    });
  }

  post({ path, body, formData }: PostRequestParams) {
    return this._apiClient({
      method: HTTP_METHOD_POST,
      path,
      body,
      formData,
    });
  }

  put({ path, id, body, formData }: PutReuqestParams) {
    return this._apiClient({
      method: HTTP_METHOD_PUT,
      path,
      ...(id && { id }),
      body,
      formData,
    });
  }

  delete({ path, id }: DeleteReuquestParams) {
    return this._apiClient({
      method: HTTP_METHOD_DELETE,
      path,
      id,
    });
  }

  getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }

  async _apiClient({ method, path, id, body, formData }: ApiClientRequests) {
    const url = API_URL + path + (id ? `/${id}` : '');

    let options: RequestInit = {
      method: method,
      mode: 'cors',
      credentials: 'include',
    };

    const csrfToken = this.getCookie('csrf_token');

    if (body && !formData && csrfToken) {
      options.headers = {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      };
      options.body = JSON.stringify(body);
    } else if (formData && csrfToken) {
      options.headers = {
        'X-CSRF-Token': csrfToken,
      };
      options.body = formData;
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorMessage = await response.text();
      throw {
        error: new Error(`Error ${response.status}: ${errorMessage}`),
        status: response.status,
      };
    }

    const jsonResponse = await response.json();
    return jsonResponse;
  }
}

export const apiClient = new ApiClient();

import { userStore } from 'store/UserStore';
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
  body?: Object;
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

  delete({ path, id, body }: DeleteReuquestParams) {
    return this._apiClient({
      method: HTTP_METHOD_DELETE,
      path,
      id,
      body,
    });
  }

  async _apiClient({ method, path, id, body, formData }: ApiClientRequests) {
    const url = API_URL + path + (id ? `/${id}` : '');

    let options: RequestInit = {
      method: method,
      mode: 'cors',
      credentials: 'include',
    };

    if (body && !formData && userStore.getCsrfToken()) {
      options.headers = {
        'Content-Type': 'application/json',
        'X-CSRF-Token': userStore.getCsrfToken(),
      };
      options.body = JSON.stringify(body);
    } else if (formData && userStore.getCsrfToken()) {
      options.headers = {
        'X-CSRF-Token': userStore.getCsrfToken(),
      };
      options.body = formData;
    } else {
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorMessage = await response.text();
      throw {
        error: new Error(`Error ${response.status}: ${errorMessage}`),
        status: response.status,
      };
    }
    try {
      const jsonResponse = await response.json();
      return jsonResponse;
    } catch {
      return response;
    }
  }
}

export const apiClient = new ApiClient();

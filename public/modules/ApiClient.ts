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
};

type GetRequestParams = {
  path: string;
  id?: number;
};

type PostRequestParams = {
  path: string;
  body: Object;
};

type PutReuqestParams = {
  path: string;
  id?: number;
  body: Object;
};

type DeleteReuquestParams = {
  path: string;
  id?: number;
};

class ApiClient {
  /**
   * GET request
   * @param {GetRequestParams} params - request parameters
   * @param {string} params.path - API endpoint path
   * @param {number} params.id - item ID (optional)
   * @returns {Promise<Object>} - response from the API
   * @throws {Error} - if the request fails
   */
  get({ path, id }: GetRequestParams) {
    return this._apiClient({
      method: HTTP_METHOD_GET,
      path,
      ...(id && { id }),
    });
  }

  /**
   * POST request
   * @param {PostRequestParams} params - request parameters
   * @param {string} params.path - API endpoint path
   * @param {Object} params.body - request payload (data to be sent)
   * @returns {Promise<Object>} - response from the API
   * @throws {Error} - if the request fails
   */
  post({ path, body }: PostRequestParams) {
    return this._apiClient({
      method: HTTP_METHOD_POST,
      path,
      body,
    });
  }

  /**
   * PUT request
   * @param {PutReuqestParams} params - request parameters
   * @param {string} params.path - API endpoint path
   * @param {number|string} params.id - item ID to update
   * @param {Object} params.body - request payload (data to be updated)
   * @returns {Promise<Object>} - response from the API
   * @throws {Error} - if the request fails
   */
  put({ path, id, body }: PutReuqestParams) {
    return this._apiClient({
      method: HTTP_METHOD_PUT,
      path,
      ...(id && { id }),
      body,
    });
  }

  /**
   * DELETE request
   * @param {DeleteReuquestParams} params - request parameters
   * @param {string} params.path - API endpoint path
   * @param {number|string} params.id - item ID to delete
   * @returns {Promise<Object>} - response from the API
   * @throws {Error} - if the request fails
   */
  delete({ path, id }: DeleteReuquestParams) {
    return this._apiClient({
      method: HTTP_METHOD_DELETE,
      path,
      id,
    });
  }

  /**
   * Send request to API
   * @param {ApiClientRequests} params - request parameters
   * @param {string} params.method - HTTP method (GET, POST, PUT, DELETE)
   * @param {string} params.path - API endpoint path
   * @param {number|string} [params.id=null] - item ID (optional)
   * @param {Object} [params.body=null] - request payload (optional)
   * @returns {Promise<Object>} - response from the API
   * @throws {Error} - if the request fails
   * @private
   */
  async _apiClient({ method, path, id, body }: ApiClientRequests) {
    const url = API_URL + path + (id ? `/${id}` : '');
    const response = await fetch(url, {
      method: method,
      headers: body
        ? { 'Content-Type': 'application/json' }
        : { 'Content-Type': 'application/json' },
      body: body && JSON.stringify(body),
      mode: 'cors',
      credentials: 'include',
    });

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
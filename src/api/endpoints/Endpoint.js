// eslint-disable-next-line no-unused-vars -- used in JSDoc
import { Api } from '../api.js'
// eslint-disable-next-line no-unused-vars -- used in JSDoc
import Request from '../request.js'
import PaginatedResponse from '../PaginatedResponse.js'

export default class Endpoint {
  /**
   * @param {Api} api
   */
  constructor(api) {
    this.api = api
  }

  /**
   * Callback for requesting data.
   *
   * @callback requestCallback
   * @param {Request} request
   * @returns {object}
   */

  /**
   * @param {requestCallback} callback
   * @returns {object}
   */
  async requestData(callback, key = 'data', config = { withAuth: false }) {
    const api = config.withAuth ? this.api.withAuth() : this.api
    const response = await callback(api.request())

    if (response === null) {
      throw new Error(`Endpoint returned invalid JSON.`)
    }
    if (response[key] === undefined) {
      throw new Error(`Key '${key}' not found in response: ${JSON.stringify(response)}`)
    }
    return response[key]
  }

  /**
   * @param {requestCallback} callback
   * @returns {PaginatedResponse}
   */
  async requestPaginatedData(callback, key = 'data', config = { withAuth: false }) {
    const api = config.withAuth ? this.api.withAuth() : this.api
    const response = await callback(config.withAuth ? this.api.withAuth().request() : this.api.request())

    if (response === null) {
      throw new Error(`Endpoint returned invalid JSON.`)
    }
    if (response[key] === undefined) {
      throw new Error(`Key '${key}' not found in response: ${JSON.stringify(response)}`)
    }
    if (response.pagination === undefined) {
      throw new Error(`Key 'pagination' not found in response: ${JSON.stringify(response)}`)
    }

    return new PaginatedResponse(response, key, api)
  }

  withoutNullValues(object) {
    return Object.fromEntries(Object.entries(object).filter(([, value]) => value !== null && value !== undefined))
  }
}

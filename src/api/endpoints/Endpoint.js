// eslint-disable-next-line no-unused-vars -- used in JSDoc
import { Api } from '../api'
// eslint-disable-next-line no-unused-vars -- used in JSDoc
import Request from '../request'

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
  async requestData(callback, key = 'data') {
    const response = await callback(this.api.request())

    if (response === null) {
      throw new Error(`Endpoint returned invalid JSON.`)
    }
    if (response[key] === undefined) {
      throw new Error(`Key '${key}' not found in response: ${JSON.stringify(response)}`)
    }
    return response[key]
  }
}

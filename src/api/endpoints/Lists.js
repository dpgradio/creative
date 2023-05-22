import Endpoint from './Endpoint.js'

export default class Lists extends Endpoint {
  async all() {
    return await this.requestData((r) => r.get(`/lists`), 'lists')
  }
}

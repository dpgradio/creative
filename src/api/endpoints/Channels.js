import Endpoint from './Endpoint.js'

export default class Channels extends Endpoint {
  async all() {
    return await this.requestData((r) => r.get('/channels'))
  }
}

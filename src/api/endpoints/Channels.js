import Endpoint from './Endpoint'

export default class Channels extends Endpoint {
  async all() {
    return await this.requestData((r) => r.get('/channels'))
  }
}

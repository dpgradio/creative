import Endpoint from './Endpoint.js'

export default class Programs extends Endpoint {
  async all() {
    return await this.requestData((r) => r.get(`/programs`), 'programs')
  }
}

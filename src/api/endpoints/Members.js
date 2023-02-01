import Endpoint from './Endpoint'

export default class Members extends Endpoint {
  async me() {
    return await this.api.request().get('/members/me')
  }
}

import Endpoint from './Endpoint.js'

export default class ForbiddenWord extends Endpoint {
  async detection(id) {
    return  this.api.request().post(`/forbidden_word/${id}/detection`)
  }
}

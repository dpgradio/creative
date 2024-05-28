import Endpoint from './Endpoint.js'

export default class ForbiddenWord extends Endpoint {
  async detection(id) {
    await this.api.request({ passAuth: true }).post(`/forbidden_words/${id}/detections`)
  }
}

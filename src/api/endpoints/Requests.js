import Endpoint from './Endpoint.js'

export default class Requests extends Endpoint {
  async requestTrack(eventSlug, request) {
    return await this.api.request().post(`/requests/${eventSlug}`, request)
  }
}

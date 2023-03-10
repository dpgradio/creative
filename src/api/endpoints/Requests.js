import Endpoint from './Endpoint.js'

export default class Requests extends Endpoint {
  async requestTrack(eventSlug, requestInfo) {
    return await this.api.request().post(`/requests/${eventSlug}`, requestInfo)
  }
}

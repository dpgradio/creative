import Endpoint from './Endpoint.js'

export default class Requests extends Endpoint {
  async requestTrack(eventSlug, request) {
    return await this.api.request({passAuth: true}).post(`/requests/${eventSlug}`, request)
  }

  async requestsForTrack(eventSlug, selectorCode) {
    return await this.requestData((r) => r.get(`/requests/${eventSlug}/track/${selectorCode}`), 'requests')
  }
}

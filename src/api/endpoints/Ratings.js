import Endpoint from './Endpoint.js'

export default class Ratings extends Endpoint {
  async allForMember() {
    return await this.requestPaginatedData((r) => r.get('/members/me/ratings'), 'ratings', { passAuth: true })
  }

  async like(selectorCode) {
    await this.api.request({ passAuth: true }).post(`/tracks/${selectorCode}/ratings`, { rating: 1 })
  }

  async unlike(selectorCode) {
    await this.api.request({ passAuth: true }).delete(`/tracks/${selectorCode}/ratings`)
  }
}

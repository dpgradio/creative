import Endpoint from './Endpoint.js'

export default class Ratings extends Endpoint {
  async allForMember() {
    return await this.requestData((r) => r.get('/members/me/ratings'), 'ratings')
  }

  async like(selectorCode) {
    await this.api.request().post(`/tracks/${selectorCode}/ratings`, { rating: 1 })
  }

  async unlike(selectorCode) {
    await this.api.request().delete(`/tracks/${selectorCode}/ratings`)
  }
}

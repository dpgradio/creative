import Endpoint from './Endpoint.js'

export default class Ratings extends Endpoint {
  async allForMember() {
    return await this.requestPaginatedData((r) => r.get('/members/me/ratings'), 'ratings', { withAuth: true })
  }

  async like(selectorCode) {
    await this.api.withAuth().request().post(`/tracks/${selectorCode}/ratings`, { rating: 1 })
  }

  async unlike(selectorCode) {
    await this.api.withAuth().request().delete(`/tracks/${selectorCode}/ratings`)
  }
}

import Endpoint from './Endpoint.js'

export default class TrackLists extends Endpoint {
  async search(trackListId, query) {
    return await this.api.request().get(`/track_lists/${trackListId}`, { query })
  }
}

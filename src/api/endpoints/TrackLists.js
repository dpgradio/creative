import Endpoint from './Endpoint.js'

/**
 * These requests support a form of pagination but not using the default pagination approach.
 * Therefore, pagination requires a manual implementation on the consuming side.
 */
export default class TrackLists extends Endpoint {
  async tracks(trackListId, { trackCodeIds, all, order, seed, page, limit } = {}) {
    const parameters = {
      track_code_ids: trackCodeIds,
      all,
      order,
      seed,
      page,
      limit,
    }

    return await this.requestData(
      (r) => r.get(`/track_lists/${trackListId}`, this.withoutNullValues(parameters)),
      'tracks'
    )
  }

  async search(trackListId, query, { order, seed, page, limit } = {}) {
    const parameters = { query, order, seed, page, limit }

    return await this.requestData(
      (r) => r.get(`/track_lists/${trackListId}/search`, this.withoutNullValues(parameters)),
      'tracks'
    )
  }

  async byLetter(trackListId, letter, { order, seed, page, limit } = {}) {
    const parameters = { order, seed, page, limit }

    return await this.requestData(
      (r) => r.get(`/track_lists/${trackListId}/by_letter/${letter}`, this.withoutNullValues(parameters)),
      'tracks'
    )
  }
}

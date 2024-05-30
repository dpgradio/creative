export default class PaginatedResponse {
  constructor(response, dataKey = 'data', api) {
    this.pagination = response.pagination
    this.data = response[dataKey]
    this.dataKey = dataKey
    this.api = api
  }

  async fetchNext() {
    if (!this.pagination.next) {
      return []
    }
    const response = await this.api.onVersion(null).request().get(this.pagination.next)
    this.pagination.next = response.pagination.next
    this.data = [...this.data, ...response[this.dataKey]]

    return response[this.dataKey]
  }

  async fetchPrevious() {
    if (!this.pagination.previous) {
      return []
    }
    const response = await this.api.onVersion(null).request().get(this.pagination.previous)
    this.pagination.previous = response.pagination.previous
    this.data = [...response[this.dataKey], ...this.data]

    return response[this.dataKey]
  }

  async fetchAllNext() {
    while ((await this.fetchNext()).length > 0) {
      continue
    }

    return this.data
  }

  async fetchAllPrevious() {
    while ((await this.fetchPrevious()).length > 0) {
      continue
    }

    return this.data
  }
}

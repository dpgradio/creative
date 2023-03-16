import api from './api.js'

export default class PaginatedResponse {
  constructor(response, dataKey = 'data') {
    this.pagination = response.pagination
    this.data = response[dataKey]
    this.dataKey = dataKey
  }

  async fetchNext() {
    const response = await api.onVersion(null).request().get(this.pagination.next)
    this.pagination.next = response.pagination.next
    this.data = [...this.data, ...response[this.dataKey]]

    return response[this.dataKey]
  }

  async fetchPrevious() {
    const response = await api.onVersion(null).request().get(this.pagination.previous)
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

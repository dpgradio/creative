import tap from '../utils/tap.js'

export default class Request {
  constructor(baseUrl, version, errorHandlers = []) {
    this.baseUrl = baseUrl
    this.version = version
    this.errorHandlers = errorHandlers
    this.queryParameters = {}
    this.data = null
    this.headers = {}
    this.fetchOptions = {}
  }

  withQueryParameters(queryParameters) {
    this.queryParameters = { ...this.queryParameters, ...queryParameters }

    return this
  }

  withData(data) {
    this.data = { ...(this.data || {}), ...data }

    return this
  }

  withFetchOptions(fetchOptions) {
    this.fetchOptions = { ...this.fetchOptions, ...fetchOptions }

    return this
  }

  withHeader(key, value) {
    return this.withHeaders({ [key]: value })
  }

  withHeaders(headers) {
    this.headers = { ...this.headers, ...headers }

    return this
  }

  async get(endpoint, parameters = {}) {
    return await this.withQueryParameters(parameters).fetchJson(endpoint)
  }

  async post(endpoint, data = {}, parameters = {}) {
    return await this.withData(data).withQueryParameters(parameters).fetchJson(endpoint, 'POST')
  }

  async put(endpoint, data = {}, parameters = {}) {
    return await this.withData(data).withQueryParameters(parameters).fetchJson(endpoint, 'PUT')
  }

  async patch(endpoint, data = {}, parameters = {}) {
    return await this.withData(data).withQueryParameters(parameters).fetchJson(endpoint, 'PATCH')
  }

  async delete(endpoint, data = {}, parameters = {}) {
    return await this.withData(data).withQueryParameters(parameters).fetchJson(endpoint, 'DELETE')
  }

  async fetchJson(endpoint, method = 'GET') {
    const url = this.constructUrl(endpoint)

    this.withHeader('Accept', 'application/json')

    if (this.data !== null) {
      this.withHeader('Content-Type', 'application/json')
      this.withFetchOptions({ body: JSON.stringify(this.data) })
    }

    const response = await fetch(url, {
      method,
      headers: this.headers,
      ...this.fetchOptions,
    })

    if (!response.ok) {
      this.errorHandlers.forEach((handler) => handler({ response }))

      throw new Error(
        `API request (${method} ${url}) failed: [${response.status}] ${response.statusText}\n\n` +
          `RESPONSE\n--------\n${await response.text()}`
      )
    }

    try {
      return await response.json()
    } catch (error) {
      return null
    }
  }

  constructUrl(endpoint) {
    const baseUrlWithProtocol = this.baseUrl.startsWith('http') ? this.baseUrl : `https://${this.baseUrl}`

    const endpointWithoutSlash = endpoint.replace(/^\/+/, '')

    return tap(new URL(`${baseUrlWithProtocol}/${this.version}/${endpointWithoutSlash}`), (url) => {
      url.search = new URLSearchParams(this.queryParameters).toString()
    })
  }
}

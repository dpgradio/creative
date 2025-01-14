import tap from '../utils/tap.js'
import hybrid from '../app/hybrid.js'

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
      if (response.status === 401) {
        const updatedToken = Promise.race([
          new Promise((resolve) => {
            hybrid.on('authenticated', (token) => resolve(token))
          }),
          new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Timeout: no token received')), 2000)
          }),
        ])

        hybrid.call('refreshExpiredToken')

        const token = (await updatedToken).radioToken
        this.withHeader('Authorization', `Bearer ${token}`)
        return this.fetchJson(endpoint, method)
      }

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

    const urlParts = endpoint.startsWith('http')
      ? [endpoint]
      : [baseUrlWithProtocol, this.version, endpointWithoutSlash].filter(Boolean)

    return tap(new URL(urlParts.join('/')), (url) => {
      url.search = new URLSearchParams({
        ...Object.fromEntries(new URLSearchParams(url.search)),
        ...this.queryParameters,
      }).toString()
    })
  }
}

import { config } from '../config/config.js'
import Request from './request.js'
import tap from '../utils/tap.js'
import Channels from './endpoints/Channels.js'
import Config from './endpoints/Config.js'
import Members from './endpoints/Members.js'
import Ratings from './endpoints/Ratings.js'

const GLOBAL_API_URL = 'https://api.radio.dpgmedia.cloud'

export const DEFAULT_VERSION = '2.9'

export class Api {
  constructor(baseUrl, version = DEFAULT_VERSION) {
    this.baseUrlOverride = baseUrl
    this.version = version

    this.requestModifiers = []

    this.errorHandlers = []

    this.apiKey = null
    this.radioToken = null

    // Endpoints
    this.channels = new Channels(this)
    this.config = new Config(this)
    this.members = new Members(this)
    this.ratings = new Ratings(this)
  }

  get baseUrl() {
    return this.baseUrlOverride || config('api_base_url')
  }

  request() {
    const modifiers = [...this.requestModifiers]

    this.apiKey && modifiers.push((request) => request.withQueryParameters({ api_key: this.apiKey }))
    this.radioToken && modifiers.push((request) => request.withHeader('Authorization', `Bearer ${this.radioToken}`))

    return tap(new Request(this.baseUrl, this.version, this.errorHandlers), (request) => {
      modifiers.forEach((modifier) => modifier(request))
    })
  }

  setApiKey(apiKey) {
    this.apiKey = apiKey
    return this
  }

  setRadioToken(token) {
    this.radioToken = token
    return this
  }

  onVersion(version) {
    return tap(this.clone(), (api) => (api.version = version))
  }

  global() {
    return tap(this.clone(), (api) => (api.baseUrlOverride = GLOBAL_API_URL))
  }

  addErrorHandler(handler) {
    this.errorHandlers.push(handler)
    return this
  }

  clone() {
    return tap(new Api(this.baseUrlOverride, this.version), (api) => {
      api.requestModifiers = this.requestModifiers
      api.errorHandlers = this.errorHandlers
    })
  }
}

export default new Api()

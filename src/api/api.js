import { config } from '../config/config'
import Request from './request'
import Channels from './endpoints/channels'
import Config from './endpoints/config'
import Members from './endpoints/Members'
import tap from '../utils/tap'

const GLOBAL_API_URL = 'https://api.radio.dpgmedia.cloud'

export const DEFAULT_VERSION = '2.9'

export class Api {
  constructor(baseUrl, version = DEFAULT_VERSION) {
    this.baseUrlOverride = baseUrl
    this.version = version

    this.requestModifiers = []

    // Endpoints
    this.channels = new Channels(this)
    this.config = new Config(this)
    this.members = new Members(this)
  }

  get baseUrl() {
    return this.baseUrlOverride || config('apiBaseUrl')
  }

  request() {
    return tap(new Request(this.baseUrl, this.version), (request) => {
      this.requestModifiers.forEach((modifier) => modifier(request))
    })
  }

  setApiKey(apiKey) {
    this.requestModifiers.push((request) => request.withQueryParameters({ api_key: apiKey }))
    return this
  }

  setRadioToken(token) {
    this.requestModifiers.push((request) => request.withHeader('Authorization', `Bearer ${token}`))
    return this
  }

  onVersion(version) {
    return tap(this.clone(), (api) => (api.version = version))
  }

  global() {
    return tap(this.clone(), (api) => (api.baseUrlOverride = GLOBAL_API_URL))
  }

  clone() {
    return tap(new Api(this.baseUrlOverride, this.version), (api) => {
      api.requestModifiers = this.requestModifiers
    })
  }
}

export default new Api()

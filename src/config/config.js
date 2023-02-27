import api from '../api/api.js'

const dotSyntaxAccess = (object, path) => path.split('.').reduce((o, p) => o[p], object)

class Configuration {
  constructor() {
    this.stationId = null
    this.appId = null
    this.rawConfig = null
  }

  setStation(stationId) {
    this.stationId = stationId

    return this
  }

  async retrieveConfigForDetectedStation(appId) {
    const parameters = new URLSearchParams(window.location.search)
    if (parameters.has('stationId')) {
      return this.retrieveConfigForStation(appId, parameters.get('stationId'))
    }
    return this.retrieveConfigByHostname(appId)
  }

  /**
   * Retrieve the configuration for the given app and the current hostname.
   */
  async retrieveConfigByHostname(appId) {
    this.appId = appId

    // This is not the most robust way to get the hostname without subdomains, e.g. .co.uk domains will break.
    // However, for the TLDs we use, this should be fine.
    const hostname = window.location.hostname.split('.').splice(-2).join('.')
    this.rawConfig = await api.global().config.app(appId, { domains: [hostname] })

    this.stationId = Object.keys(this.rawConfig)[0]

    return this
  }

  /**
   * Retrieve the configuration for the given app and the given station(s).
   */
  async retrieveConfigForStation(appId, ...stationIds) {
    this.appId = appId
    this.stationId = stationIds[0]

    this.rawConfig = await api.global().config.app(appId, { stationIds })

    return this
  }

  config(property = null) {
    if (!this.rawConfig) {
      throw new Error('No config retrieved. First use [config.retrieveConfig] to retrieve the configuration.')
    }
    if (!this.stationId) {
      throw new Error('No station set. First use [config.setStation] to set the station.')
    }
    if (!this.appId) {
      throw new Error('No app identifier set. First use [config.retrieveConfig] to retrieve the configuration.')
    }
    if (!this.rawConfig[this.stationId]?.[this.appId]) {
      throw new Error(
        `No configuration found for station [${this.stationId}] and app [${this.appId}]. Make sure the app is enabled for this station.`
      )
    }

    const stationConfig = {
      ...this.rawConfig[this.stationId],
      app: this.rawConfig[this.stationId][this.appId],
    }

    return property ? dotSyntaxAccess(stationConfig, property) : stationConfig
  }

  async replaceSchema(appId, schema) {
    await api.global().config.updateSchema(appId, schema)
  }
}

const configuration = new Configuration()

export default configuration

export const config = configuration.config.bind(configuration)

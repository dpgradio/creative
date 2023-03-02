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

  /**
   * Retrieve the configuration for the current hostname or present query parameter and the given app (optional).
   */
  async retrieveConfigForDetectedStation(appId = null) {
    const parameters = new URLSearchParams(window.location.search)
    if (parameters.has('stationId')) {
      return this.retrieveConfigForStation(appId, parameters.get('stationId'))
    }
    return this.retrieveConfigByHostname(appId)
  }

  /**
   * Retrieve the configuration for the current hostname and the given app (optional).
   */
  async retrieveConfigByHostname(appId = null) {
    this.appId = appId

    // This is not the most robust way to get the hostname without subdomains, e.g. .co.uk domains will break.
    // However, for the TLDs we use, this should be fine.
    const hostname = window.location.hostname.split('.').splice(-2).join('.')

    if (appId) {
      this.rawConfig = await api.global().config.app(appId, { domains: [hostname] })
    } else {
      this.rawConfig = await api.global().config.global({ domains: [hostname] })
    }

    this.stationId = Object.keys(this.rawConfig)[0]

    return this
  }

  /**
   * Retrieve the configuration for the given station and the given app (optional).
   */
  async retrieveConfigForStation(stationId, appId = null) {
    return await this.retrieveConfigForStations([stationId], appId)
  }

  /**
   * Retrieve the configuration for the given stations and the given app (optional).
   */
  async retrieveConfigForStations(stationIds, appId = null) {
    this.appId = appId
    this.stationId = stationIds[0]

    if (appId) {
      this.rawConfig = await api.global().config.app(appId, { stationIds })
    } else {
      this.rawConfig = await api.global().config.global({ stationIds })
    }

    return this
  }

  config(property = null) {
    if (!this.rawConfig) {
      throw new Error('No config retrieved. First use [config.retrieveConfig] to retrieve the configuration.')
    }
    if (!this.stationId) {
      throw new Error('No station set. First use [config.setStation] to set the station.')
    }
    if (!this.rawConfig[this.stationId]) {
      throw new Error(
        `No configuration found for station [${this.stationId}]. Make sure there is a global config for this station.`
      )
    }
    if (this.appId && !this.rawConfig[this.stationId]?.[this.appId]) {
      throw new Error(
        `No configuration found for station [${this.stationId}] and app [${this.appId}]. Make sure the app is enabled for this station.`
      )
    }

    const stationConfig = {
      ...this.rawConfig[this.stationId],
      ...(this.appId ? { app: this.rawConfig[this.stationId][this.appId] } : {}),
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

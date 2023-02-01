import api from '../api/api'

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

  async retrieveConfig(appId) {
    this.appId = appId

    this.rawConfig = await api.global().config.app(appId)

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

    const stationConfig = {
      ...this.rawConfig[this.stationId],
      app: this.rawConfig[this.stationId][this.appId],
    }

    return property ? dotSyntaxAccess(stationConfig, property) : stationConfig
  }

  async replaceSchema(appId, schema) {
    api.global().config.updateSchema(appId, schema)
  }
}

const configuration = new Configuration()

export default configuration

export const config = configuration.config.bind(configuration)

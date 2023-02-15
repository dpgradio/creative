import Endpoint from './Endpoint.js'

export default class Config extends Endpoint {
  async global() {
    return await this.requestData((r) => r.get('/config'))
  }

  async app(appId, stationIds) {
    return await this.requestData((r) => r.get(`/config/${appId}`, { station_ids: stationIds }))
  }

  async updateSchema(appId, schema) {
    await this.api.request().put(`/config/${appId}`, { schema })
  }
}

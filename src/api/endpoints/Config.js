import Endpoint from './Endpoint.js'

export default class Config extends Endpoint {
  async global({ stationIds = null, domains = null }) {
    return await this.requestData((r) => r.get('/config', this.withoutNullValues({ station_ids: stationIds, domains })))
  }

  async app(appId, { stationIds = null, domains = null }) {
    return await this.requestData((r) =>
      r.get(`/config/${appId}`, this.withoutNullValues({ station_ids: stationIds, domains }))
    )
  }

  async updateSchema(appId, schema) {
    await this.api.request().put(`/config/${appId}`, { schema })
  }
}

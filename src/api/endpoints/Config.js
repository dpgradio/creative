import Endpoint from './Endpoint'

export default class Config extends Endpoint {
  async global() {
    return await this.requestData((r) => r.get('/config'))
  }

  async app(appId) {
    return await this.requestData((r) => r.get(`/config/${appId}`))
  }

  async updateSchema(appId, schema) {
    await this.api.request().put(`/config/${appId}`, { schema })
  }
}

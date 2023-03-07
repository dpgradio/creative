import Endpoint from './Endpoint.js'

export default class Members extends Endpoint {
  async me() {
    return await this.api.request().get('/members/me')
  }

  async updatePhoneNumber(mobile) {
    return await this.api.request().put("/members/me", { profile: { mobile: mobile } })
  }
}

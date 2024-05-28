import Endpoint from './Endpoint.js'

export default class Members extends Endpoint {
  async me() {
    return await this.api.request({ passAuth: true }).get('/members/me')
  }

  async updateProfile(profile) {
    return await this.api.request({ passAuth: true }).put('/members/me', { profile })
  }
}

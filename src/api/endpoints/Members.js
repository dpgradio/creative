import Endpoint from './Endpoint.js'

export default class Members extends Endpoint {
  async me() {
    return await this.api.withAuth().request().get('/members/me')
  }

  async updateProfile(profile) {
    return await this.api.withAuth().request().put('/members/me', { profile })
  }
}

import SocketSubscription from './SocketSubscription'

export default class SocketStation {
  constructor(connection, station) {
    this.connection = connection
    this.station = station
  }

  subscribe(entity) {
    return new SocketSubscription(this.connection, this.station, entity)
  }

  authenticate(method, authParams) {
    this.connection._registerAuthentication({ station: this.station, method, ...authParams })
  }
}

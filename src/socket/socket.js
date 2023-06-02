import SocketConnection from './SocketConnection.js'
import SocketStation from './SocketStation.js'

// This is a JS rewrite of [https://github.com/medialaan/radio-sockets-server/blob/master/dist/q.coffee] with some minor additional functionality.
class Socket {
  constructor() {
    this.connections = {}
  }

  connect(station, host = 'https://socket.qmusic.be/api', options = {}) {
    const connectionOptions = {
      debug: false,
      catchErrors: false,
      maxRetryTimeout: 10,
      ...options,
    }

    if (!this.connections[host]) {
      this.connections[host] = new SocketConnection(host, connectionOptions)
    }

    return new SocketStation(this.connections[host], station)
  }

  /**
   * Shortcut for subscribing to an entity action.
   *
   * Instead of `socket.connect('station').subscribe('entity').on('action', () => { ... })`
   * you can use `socket.join({ station: 'station', entity: 'entity', action: 'action' }, () => { ... })`.
   */
  join({ station, entity, action, options = {} }, callback) {
    return this.connect(station).subscribe(entity).on(action, callback, options)
  }
}

export default new Socket()

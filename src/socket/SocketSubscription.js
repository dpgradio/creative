export default class SocketSubscription {
  constructor(connection, station, entity) {
    this.connection = connection
    this.station = station
    this.entity = entity

    this.callbacks = {}
  }

  subscribe(entity) {
    this.connection.subscribe(entity)
  }

  listen(callback, options = {}) {
    this.on(null, callback, options)

    return this
  }

  on(action, callback, options = {}) {
    const id = this.connection._registerSubscription({
      sub: {
        station: this.station,
        entity: this.entity,
        action,
        scope: options.scope,
      },
      callback,
      backlog: options.backlog,
    })

    this.callbacks[action] = id

    return this
  }

  off(action) {
    const id = this.callbacks[action]
    this.connection._unregister(id)
  }

  unsubscribe() {
    for (const id of Object.values(this.callbacks)) {
      this.connection._unregister(id)
    }
  }
}

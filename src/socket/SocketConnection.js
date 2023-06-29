import SockJS from 'sockjs-client/dist/sockjs.js'

export default class SocketConnection {
  constructor(host, options) {
    this.host = host
    this.options = options

    this.lastId = 0
    this.subscriptions = {}
    this.authData = []
    this.messages = []
    this.lastAttempt = 1
    this.reconnecting = false

    this.connect()
  }

  connect() {
    this.socket = new SockJS(this.host)

    this.socket.onopen = () => {
      this.log('Connected')

      // Reset lastAttempt counter
      this.lastAttempt = 1

      if (this.reconnecting) {
        this._reauthenticate()
        this._resubscribeSubscriptions()
      }

      this.reconnecting = false
      this.flushMessages()
    }

    this.socket.onmessage = (event) => {
      this.log('>>>', event.data)

      try {
        const message = JSON.parse(event.data)
        this.processMessage(message)
      } catch (e) {
        this.log('Failed to parse server response', event.data)
        return
      }
    }

    this.socket.onclose = (event) => {
      this.log(`Disconnected ${event.code}`, event)

      // This is a technical issue, try again
      if ([1000, 1001, 1002, 1003, 1004, 1005, 1006, 2000].includes(event.code)) {
        this.reconnecting = true
        setTimeout(() => {
          this.connect()
        }, this.lastAttempt * 1000)

        this.lastAttempt *= 2
        if (this.lastAttempt > this.options.maxRetryTimeout) {
          this.lastAttempt = this.options.maxRetryTimeout
        }
      }
    }
  }

  processMessage(message) {
    if (message.action !== 'data') {
      return
    }
    const payload = JSON.parse(message.data)

    // Contribute internal ID
    payload._push_id = message.key || null

    for (const n of message.ids) {
      try {
        const callback = this.subscriptions[n]?.callback

        callback(payload.data, payload)
      } catch (error) {
        this.log(error)

        if (!this.options.catchErrors) {
          throw error
        }
      }
    }
  }

  flushMessages() {
    if (this.isConnected()) {
      for (const msg of this.messages) {
        this.send(...msg)
      }
      this.messages = []
    }
  }

  isConnected() {
    return this.socket.readyState === 1
  }

  send(...args) {
    if (this.isConnected()) {
      this.log('<<<', ...args)
      this.socket.send(args)
    } else {
      this.messages.push(args)
    }
  }

  log(...args) {
    if (this.options.debug) {
      console?.log(...args)
    }
  }

  _registerSubscription(subscription) {
    const subscriptionId = this.lastId++

    this.subscriptions[subscriptionId] = subscription

    this._sendSubscription(subscription, subscriptionId)

    return subscriptionId
  }

  _registerAuthentication(authentication) {
    this.authData.push(authentication)

    this._sendAuthentication(authentication)
  }

  _unregister(id) {
    delete this.subscriptions[id]
  }

  _sendSubscription(subscription, id) {
    const msg = {
      action: 'join',
      id,
      sub: subscription.sub,
    }

    if (subscription.backlog) {
      msg.backlog = subscription.backlog
    }

    this.send(JSON.stringify(msg))
  }

  _sendAuthentication(params) {
    const msg = { action: 'authenticate', ...params }

    this.send(JSON.stringify(msg))
  }

  _resubscribeSubscriptions() {
    for (const [id, subscription] of Object.entries(this.subscriptions)) {
      this._sendSubscription({ sub: subscription.sub }, id)
    }
  }

  _reauthenticate() {
    for (const auth of this.authData) {
      this._sendAuthentication(auth)
    }
  }
}

import privacy from '../privacy/privacy.js'

class Mixpanel {
  constructor() {
    this.trackingEvents = false
    this.trackBacklog = []
    this.mixpanel = null
  }

  initialize(Mixpanel, { mixpanelId, trackPageview = true }) {
    this.mixpanel = Mixpanel
    privacy.push('analytics', () => {
      this.mixpanel.init(mixpanelId, {
        track_pageview: trackPageview,
        persistence: 'localStorage',
        api_host: 'https://api-eu.mixpanel.com',
      })

      while (this.trackBacklog.length > 0) {
        const { eventName, properties } = this.trackBacklog.shift()
        this.mixpanel.track(eventName, properties)
      }

      this.trackingEvents = true
    })
  }

  pushEvent(eventName, properties) {
    if (this.trackingEvents) {
      this.mixpanel.track(eventName, properties)
    } else {
      this.trackBacklog.push({ eventName, properties })
    }
  }
}

export default new Mixpanel()

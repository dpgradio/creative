import privacy from '../privacy/privacy.js'

class Mixpanel {
  constructor() {
    this.trackingEvents = false
    this.trackBacklog = []
    this.mixpanel = null
  }

  initialize(Mixpanel, { mixpanelId, track_pageview = true }) {
    this.mixpanel = Mixpanel
    privacy.push('analytics', () => {
      this.mixpanel.init(mixpanelId, {
        track_pageview,
        persistence: 'localStorage',
        api_host: 'https://api-eu.mixpanel.com',
      })

      while (this.trackBacklog.length > 0) {
        const { eventName, properties } = this.trackBacklog.shift()
        this.mixpanel.track(eventName, properties)
      }
    })
  }

  trackEvent(eventName, properties) {
    if (this.trackingEvents) {
      this.mixpanel.track(eventName, properties)
    } else {
      this.trackBacklog.push({ eventName, properties })
    }
  }
}

export default new Mixpanel()

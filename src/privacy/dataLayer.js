import hybrid from '../utils/hybrid'
import loadScript from '../utils/loadScript'

class DataLayer {
  constructor() {
    window.dataLayer = window.dataLayer || []
  }

  initialize(gtmId = 'GTM-TW99VZN') {
    loadScript(`https://www.googletagmanager.com/gtm.js?id=${gtmId}`)

    this.pushGtmStart()
    this.pushUserWhenAuthenticated()
  }

  push(data) {
    window.dataLayer.push(data)
  }

  pushGtmStart() {
    this.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })
  }

  pushEvent(event, data) {
    this.push({ event, ...data })
  }

  pushUserWhenAuthenticated() {
    hybrid.on('authenticated', ({ radioToken }) => {
      if (radioToken) {
        this.pushEvent('account_id', this._formatUserInformation(radioToken))
      }
    })
  }

  async pushVirtualPageView(brand) {
    const user = await this._getUserInformationOnLoad()

    this.pushEvent('VirtualPageView', {
      virtualPageURL: {
        ...window.location,
        platform: 'browser',
        brand,
      },
      ...user,
    })
  }

  async _getUserInformationOnLoad() {
    if (!hybrid.isNativeApp()) {
      return {}
    }
    try {
      const radioToken = await hybrid.appLoaded()
      return this._formatUserInformation(radioToken)
    } catch (error) {
      console.error('User information could not be loaded:', error)
      return {}
    }
  }

  _formatUserInformation(radioToken) {
    return {
      user: {
        account_id: hybrid.decodeRadioToken(radioToken).uid,
        loggedIn: true,
      },
    }
  }
}

export default new DataLayer()

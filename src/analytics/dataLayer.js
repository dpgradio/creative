import hybrid from '../app/hybrid.js'
import { config } from '../config/config.js'
import decodeRadioToken from '../utils/decodeRadioToken.js'
import loadScript from '../utils/loadScript.js'

class DataLayer {
  constructor() {
    if (typeof window === 'undefined') {
      return
    }

    window.dataLayer = window.dataLayer || []
    this.campaignDetails = {}
    this.userInformation = {}
  }

  /**
   * @param {Object} parameters   The parameters object.
   * @param {string} [parameters.gtmId]   The GTM ID - Defaults to our default GTM tag
   * @param {string} [parameters.nonce]   The nonce value for the script tag (Used for CSP).
   */
  initialize(parameters) {
    // Backwards compatability
    if (typeof parameters === 'string') {
      parameters = { gtmId: parameters }

      // Deprecation warning in development
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          '@dpgmedia/creative',
          'DEPRECATION WARNING: new Datalayer(gtmId) is deprecated, please use new Datalayer({ gtmId }) instead.'
        )
      }
    }

    const { gtmId = 'GTM-TW99VZN', nonce } = parameters || {}

    loadScript(`https://www.googletagmanager.com/gtm.js?id=${gtmId}`, { nonce })

    this.pushGtmStart()
    this.pushUserWhenAuthenticated()
    this._getUserInformationOnLoad()
  }

  setCampaignDetails(details) {
    this.campaignDetails = {
      inApp: hybrid.isNativeApp(),
      ...details,
    }
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

  async pushCampaignAction(action, data) {
    this.push({
      event: 'campaign_action',
      campaign: {
        ...this.campaignDetails,
        action,
        ...data,
      },
      ...this.userInformation,
    })
  }

  pushUserWhenAuthenticated() {
    hybrid.on('authenticated', ({ radioToken }) => {
      if (radioToken) {
        this.setUserInformation(radioToken)
        this.pushEvent('account_id', this.userInformation)
      }
    })
  }

  async pushVirtualPageView(brand = config('gtm_brand')) {
    await this._getUserInformationOnLoad()

    this.pushEvent('VirtualPageView', {
      virtualPageURL: {
        ...window.location,
        platform: 'browser',
        brand,
      },
      user: this.userInformation,
    })
  }

  async _getUserInformationOnLoad() {
    if (hybrid.isNativeApp()) {
      try {
        const radioToken = await hybrid.appLoaded()
        this.setUserInformation(radioToken)
      } catch (error) {
        console.error('User information could not be loaded:', error)
      }
    }
  }

  setUserInformation(radioToken) {
    this.userInformation = {
      account_id: decodeRadioToken(radioToken).uid,
      loggedIn: true,
    }
  }
}

export default new DataLayer()

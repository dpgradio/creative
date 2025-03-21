import { config } from '../config/config.js'
import loadScript from '../utils/loadScript.js'

class Privacy {
  constructor() {
    if (typeof window === 'undefined') {
      return
    }

    window._privacy = window._privacy || []

    this.consent = undefined
    this.consentSubscribers = []
  }

  /**
   * Load the CMP script asynchronously.
   *
   * @param {string}  privacyManagerId   e.g. '148844'
   * @param {string}  websiteUrl         e.g. 'https://qmusic.nl'
   * @param {string}  cmpCname           e.g. 'https://cmp.qmusic.nl'
   * @param {Object}  options            Additional options.
   * @param {string}  [options.nonce]    The nonce value for the script tag (Used for CSP).
   */
  initialize(
    privacyManagerId = config('privacy_manager_id'),
    websiteUrl = config('website_url'),
    cmpCname = config('cmp_cname'),
    { nonce = undefined } = {}
  ) {
    window.cmpProperties = {
      privacyManagerId,
      cmpCname,
      baseUrl: websiteUrl,
      language: 'nl',
    }

    loadScript('https://myprivacy-static.dpgmedia.net/consent.js', { nonce })

    this.requestConsentInformation()
  }

  /**
   * Request consent information from the CMP.
   *
   * This method should be called immediately after loading the page.
   * The timeout is set to 10 seconds, after which we assume the CMP could not be loaded (potentially blocked by the browser).
   * In that case, we set the consent to null to indicate that we don't know the consent status.
   * When {@link waitForConsent} is called, it will immediately resolve with null instead of waiting for its own timeout.
   *
   * @param {number} timeoutTime
   */
  requestConsentInformation(timeoutTime = 10000) {
    const timeout = setTimeout(() => {
      this.consent = null
      this.consentSubscribers.forEach((subscriber) => subscriber(null))
    }, timeoutTime)

    this.pushConsentGiven((consentData) => {
      let updatedConsentData = {
        consentString: consentData.tcString,
        purposes: new Set(consentData.dpgConsentString.split('|')),
      }
      const iabPurposePromises = []

      // We have 10 IAB purposes, so we create 10 promises that resolve with the purpose number or null if the purpose is not given.
      for (let i = 1; i < 11; i++) {
        iabPurposePromises.push(
          new Promise((resolve) => {
            this.push(
              i,
              () => resolve(i), // Resolve with the purpose number
              () => resolve(null) // Resolve without a value, indicating that the purpose is not given
            )
          })
        )
      }

      Promise.all(iabPurposePromises).then((purposeConsents) => {
        updatedConsentData = purposeConsents.reduce((acc, purpose) => {
          if (purpose) {
            acc.purposes.add(purpose)
          }
          return acc
        }, updatedConsentData)

        this.consent = new Consent(updatedConsentData)
        this.consentSubscribers.forEach((subscriber) => subscriber(this.consent))

        clearTimeout(timeout)
      })
    })
  }

  /**
   * Wait for {@param timeoutTime} milliseconds for consent information to be available.
   *
   * @param {number} timeoutTime
   * @returns {Promise<Consent>}
   */
  waitForConsent(timeoutTime = 1000) {
    return new Promise((resolve, reject) => {
      if (this.consent) {
        return resolve(this.consent)
      }
      const timeout = setTimeout(() => reject(new Error('Retrieving consent information timed out.')), timeoutTime)
      this.consentSubscribers.push((consent) => {
        clearTimeout(timeout)
        resolve(consent)
      })
    })
  }

  push(type, successCallback, failCallback = () => {}) {
    window._privacy.push([type, successCallback, failCallback])
  }

  pushConsentGiven(callback) {
    this.push('consentgiven', callback)
  }

  pushFunctional(callback) {
    this.push('functional', callback)
  }
}

class Consent {
  constructor(consentData) {
    this.consentString = consentData.consentString
    this.purposes = consentData.purposes
  }

  allowsTargetedAdvertising() {
    return this.purposes.has('targeted_advertising')
  }
}

export default new Privacy()

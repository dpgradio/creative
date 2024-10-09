import decodeRadioToken from '../utils/decodeRadioToken.js'

// Modern versions of the radio apps set up specific User-Agents:
// Android User-Agent: Qmusic/7.6.1 (nl.qmusic.app; build:21726; Android 11; Sdk:30; Manufacturer:OnePlus; Model: IN2013) OkHttp/ 4.9.1
// iOS User-Agent: Joe/265 (be.vmma.joe.app; build:1; iOS 14.8.1) Alamofire/265
const ANDROID_APP_REGEX =
  /^(?<brand>.+)\/(?<storeVersion>[0-9.]+) \((?<buildName>.+); build:(?<buildVersion>\d+); (?<platform>Android) (?<osVersion>\d+); Sdk:(?<sdkVersion>\d+); Manufacturer:(?<manufacturer>.+); Model: (?<model>.+)\)/
const IOS_APP_REGEX =
  /^(?<brand>.+)\/(?<buildVersion>[0-9.]+) \((?<buildName>.+); build:(?<internalBuildVersion>\d+); (?<platform>iOS) (?<osVersion>\d+\.\d+\.\d+)\)/

class Hybrid {
  OPEN_URL_MODES = {
    SEQUE: 'seque',
    OVERLAY: 'overlay',
    IN_APP_BROWSER: 'in-app-browser',
    EXTERNAL_BROWSER: 'external-browser',
  }

  constructor() {
    if (typeof window === 'undefined') {
      return
    }

    // Hook this on window so it can be required in multiple packs
    window._hybridEventSubscriptions = window._hybridEventSubscriptions || {}

    this._cachedRadioTokenOnLoad = undefined
    this.on('appLoad', (context) => {
      this._cachedRadioTokenOnLoad = context?.radioToken ?? null
    })
  }

  appInfo() {
    return this.detectApp(window.appVersion || navigator.userAgent)
  }

  isNativeApp() {
    return this.appInfo().platform !== 'browser'
  }

  isVersion({ android, ios }) {
    const { platform, buildName, buildVersion } = this.appInfo()

    return (
      (platform === 'Android' && android[buildName] && android[buildName] <= parseInt(buildVersion, 10)) ||
      (platform === 'iOS' && ios <= parseInt(buildVersion, 10))
    )
  }

  call(method, options = {}) {
    if (window.webkit && window.webkit.messageHandlers) {
      const handler = window.webkit.messageHandlers[method]
      handler && handler.postMessage(options)
    } else if (window.Android) {
      // Note: It's important to either directly call window.Android[method], or bind it with
      //   const ref = window.android[method].bind(Android)
      //   ref()
      // ref: https://bugs.chromium.org/p/chromium/issues/detail?id=514628
      window.Android[method](JSON.stringify(options))
    } else {
      console.error('Call on unsupported device', method, options)
    }
  }

  on(method, fn, once = false) {
    if (!window._hybridEventSubscriptions[method]) {
      window._hybridEventSubscriptions[method] = []
    }
    window._hybridEventSubscriptions[method].push({ fn, once })
    this.ensureTriggerExists(method)
  }

  one(method, fn) {
    this.one(method, fn, true)
  }

  appLoaded() {
    return new Promise((resolve, reject) => {
      if (this._cachedRadioTokenOnLoad !== undefined) {
        return resolve(this._cachedRadioTokenOnLoad)
      }
      this.on('appLoad', (context) => {
        context?.radioToken ? resolve(context.radioToken) : reject('No radio token provided')
      })
    })
  }

  ensureTriggerExists(method) {
    if (window[method]) {
      return
    }

    window[method] = (args) => {
      const callbacks = window._hybridEventSubscriptions[method] || []
      for (const callback of callbacks) {
        callback.fn(args)
        if (callback.once) {
          callback.delete = true // Mark for deletion
        }
      }
      window._hybridEventSubscriptions[method] = callbacks.filter((callback) => !callback.delete) // Delete all marked
    }
  }

  detectApp(userAgent) {
    for (const regex of [ANDROID_APP_REGEX, IOS_APP_REGEX]) {
      const match = userAgent.match(regex)
      if (match) {
        return match.groups
      }
    }
    return { platform: 'browser' }
  }

  /**
   * @deprecated Use the {@link decodeRadioToken} helper instead.
   */
  decodeRadioToken(token) {
    return decodeRadioToken(token)
  }

  /**
   * Opens an external URL.
   *
   * Supported modes:
   * - `seque`: Opens the URL in a windows that slides from the right, pushing onto the current page.
   * - `overlay`: Opens the URL in a full-screen modal that slides up from the bottom.
   * - `in-app-browser`: Opens the URL in an in-app browser with navigation controls. No hybrid functionality supported.
   * - `external-browser`: Opens the URL in the default browser. No hybrid functionality supported.
   *
   * This replaces the `navigateTo` method which is now deprecated.
   */
  openUrl(url, { mode = 'overlay' } = {}) {
    if (!Object.values(this.OPEN_URL_MODES).includes(mode)) {
      throw new Error(
        `Invalid openUrl mode: "${mode}", supported modes are "${Object.values(this.OPEN_URL_MODES).join('", "')}".`
      )
    }

    this.call('openUrl', { url, mode })
  }

  /**
   * Opens a permalink of e.g. an article. The article will be shown in a regular `seque` style.
   *
   * As of October 2023, not yet supported by the apps.
   */
  openPermalink(permalink) {
    this.call('openPermalink', { permalink })
  }

  /**
   * Shows an authentication dialog.
   *
   * On Android this is shown regardless of the login status, on iOS it's only shown when the user is not logged in.
   */
  showAuthentication() {
    this.call('showAuthentication', { tier: 'light' })
  }

  /**
   * Changes the height of the webview.
   *
   * Animation is only supported on Android.
   */
  changeHeight(height, { animated = false } = {}) {
    this.call('changeHeight', { height, animated })
  }
}

export default new Hybrid()

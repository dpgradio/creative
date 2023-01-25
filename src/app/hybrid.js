import jwtDecode from 'jwt-decode'

// Modern versions of the radio apps set up specific User-Agents:
// Android User-Agent: Qmusic/7.6.1 (nl.qmusic.app; build:21726; Android 11; Sdk:30; Manufacturer:OnePlus; Model: IN2013) OkHttp/ 4.9.1
// iOS User-Agent: Joe/265 (be.vmma.joe.app; build:1; iOS 14.8.1) Alamofire/265
const androidRegexp =
  /^(?<brand>.+)\/(?<storeVersion>[0-9.]+) \((?<buildName>.+); build:(?<buildVersion>\d+); (?<platform>Android) (?<osVersion>\d+); Sdk:(?<sdkVersion>\d+); Manufacturer:(?<manufacturer>.+); Model: (?<model>.+)\)/
const iOSRegexp =
  /^(?<brand>.+)\/(?<buildVersion>[0-9.]+) \((?<buildName>.+); build:(?<internalBuildVersion>\d+); (?<platform>iOS) (?<osVersion>\d+\.\d+\.\d+)\)/

class Hybrid {
  constructor() {
    // Hook this on window so it can be required in multiple packs
    window._hybridEventSubscriptions = window._hybridEventSubscriptions || {}

    this.appInfo = this.detectApp(window.appVersion || navigator.userAgent)

    this._cachedRadioTokenOnLoad = undefined
    this.on('appLoad', (context) => {
      this._cachedRadioTokenOnLoad = context?.radioToken ?? null
    })
  }

  isNativeApp() {
    return this.appInfo.platform !== 'browser'
  }

  isVersion({ android, ios }) {
    const { platform, buildName, buildVersion } = this.appInfo

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
    for (const regexp of [androidRegexp, iOSRegexp]) {
      const match = userAgent.match(regexp)
      if (match) {
        return match.groups
      }
    }
    return { platform: 'browser' }
  }

  decodeRadioToken(token) {
    return jwtDecode(token)
  }
}

export default new Hybrid()

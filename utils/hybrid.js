// Hook this on window so it can be required in multiple packs
window._hybridEventSubscriptions = window._hybridEventSubscriptions || {}

// Modern versions of the radio apps set up specific User-Agents
// Android User-Agent: Qmusic/7.6.1 (nl.qmusic.app; build:21726; Android 11; Sdk:30; Manufacturer:OnePlus; Model: IN2013) OkHttp/ 4.9.1
// iOS User-Agent: Joe/265 (be.vmma.joe.app; build:1; iOS 14.8.1) Alamofire/265
const androidRegexp = /^(?<brand>.+)\/(?<storeVersion>[0-9.]+) \((?<buildName>.+); build:(?<buildVersion>\d+); (?<platform>Android) (?<osVersion>\d+); Sdk:(?<sdkVersion>\d+); Manufacturer:(?<manufacturer>.+); Model: (?<model>.+)\)/
const iOSRegexp = /^(?<brand>.+)\/(?<buildVersion>[0-9.]+) \((?<buildName>.+); build:(?<internalBuildVersion>\d+); (?<platform>iOS) (?<osVersion>\d+\.\d+\.\d+)\)/

const detectApp = (userAgent) => {
  for (const regexp of [androidRegexp, iOSRegexp]) {
    const match = userAgent.match(regexp)
    if (match) { return match.groups }
  }

  return {
    platform: 'browser'
  }
}

const appInfo = detectApp(navigator.userAgent)

// Check if the app is at least a certain version
// This differs between brands, so we need to define per brand
export const isVersion = ({android, ios}) => {
  const {platform, buildName, buildVersion} = appInfo

  return (
    (platform === 'Android' && android[buildName] && android[buildName] <= parseInt(buildVersion, 10)) ||
    (platform === 'iOS' && ios <= parseInt(buildVersion, 10))
  )
}

const ensureTriggerExists = (method) => {
  if (window[method]) { return }

  window[method] = (args) => {
    const callbacks = window._hybridEventSubscriptions[method] || []
    for (const cb of callbacks) {
      cb.fn(args)
      if (cb.once) { cb.delete = true } // Mark for deletion
    }
    window._hybridEventSubscriptions[method] = callbacks.filter(cb => !cb.delete) // Delete all marked
  }
}

export default {
  install(Vue) {
    const hybrid = this

    Vue.directive("external", {
      bind(el, { modifiers: { inApp } }) {
        inApp = !!inApp // Force false / true

        el.addEventListener("click", (e) => {
          const url = el.getAttribute("href")
          hybrid.call("navigateTo", { url, inApp })
          e.preventDefault()
        })
      }
    })
  },
  isNativeApp() {
    return detectApp(navigator.userAgent).platform !== 'browser'
  },
  isVersion,
  on(method, fn) {
    if (!window._hybridEventSubscriptions[method]) { window._hybridEventSubscriptions[method] = [] }
    window._hybridEventSubscriptions[method].push({fn, once: false})
    ensureTriggerExists(method)
  },
  one(method, fn) {
    if (!window._hybridEventSubscriptions[method]) { window._hybridEventSubscriptions[method] = [] }
    window._hybridEventSubscriptions[method].push({fn, once: true})
    ensureTriggerExists(method)
  },
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
      console.log(method, options)
      // Do nothing for now
    }
  }
}

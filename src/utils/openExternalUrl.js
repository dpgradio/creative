import hybrid from '../app/hybrid.js'

/**
 * Opens an external URL as separate as possible from the current page.
 *
 * @param {string} url The absolute URL to open.
 * @param {object} options Options for opening, includes the app mode see {@link hybrid.OPEN_URL_MODES}.
 */
export default function openExternalUrl(url, { appMode = hybrid.OPEN_URL_MODES.IN_APP_BROWSER } = {}) {
  const chromeAgent = navigator.userAgent.indexOf('Chrome') > -1
  const safariAgent = chromeAgent ? false : navigator.userAgent.indexOf('Safari') > -1

  if (hybrid.isNativeApp()) {
    hybrid.openUrl(url, { mode: appMode })
  } else if (!safariAgent) {
    window.open(url)
  } else {
    window.location = url
  }
}

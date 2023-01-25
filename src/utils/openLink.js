import hybrid from '../app/hybrid'

export default function openLink(url) {
  const chromeAgent = navigator.userAgent.indexOf('Chrome') > -1
  const safariAgent = chromeAgent ? false : navigator.userAgent.indexOf('Safari') > -1

  if (hybrid.isNativeApp()) {
    hybrid.call('navigateTo', { url, inApp: false })
  } else if (!safariAgent) {
    window.open(url)
  } else {
    window.location = url
  }
}

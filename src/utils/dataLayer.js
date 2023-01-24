import hybrid from './hybrid'
import jwtDecode from 'jwt-decode'

window.dataLayer = window.dataLayer || []

let virtualPageParams = {
  ...window.location,
  platform: hybrid.appInfo.platform,
}

let VirtualPageViewReadyResolve = null
let AppLoadedResolve = null

const VirtualPageViewReadyPromise = new Promise((resolve) => (VirtualPageViewReadyResolve = resolve))
const AppLoadedPromise = new Promise((resolve) => (AppLoadedResolve = resolve))

function setVirtualPageViewParams(params) {
  virtualPageParams = {
    ...virtualPageParams,
    ...params,
  }
}

function setVirtualPageViewReady() {
  VirtualPageViewReadyResolve()
}

Promise.all([VirtualPageViewReadyPromise, AppLoadedPromise]).then(() => {
  window.dataLayer.push({
    event: 'VirtualPageView',
    virtualPageURL: virtualPageParams,
  })
})

if (hybrid.appInfo.platform === 'browser') {
  // currently we don't wait for user token, like in app
  AppLoadedResolve()
} else {
  hybrid.on('appLoad', ({ radioToken }) => {
    if (radioToken) {
      const { uid } = jwtDecode(radioToken)

      setVirtualPageViewParams({
        user: {
          account_id: uid,
          loggedIn: true,
        },
      })
    }

    AppLoadedResolve()
  })

  hybrid.on('authenticated', ({ radioToken }) => {
    if (radioToken) {
      const { uid } = jwtDecode(radioToken)

      window.dataLayer.push({
        event: 'account_id',
        user: {
          account_id: uid,
          loggedIn: true,
        },
      })
    }
  })
}

export default {
  setVirtualPageViewParams,
  setVirtualPageViewReady,
}

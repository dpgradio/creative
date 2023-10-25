import api from '../api/api.js'
import hybrid from './hybrid.js'
import { onLocalStorageChange } from '../utils/onLocalStorageChange.js'

export const RADIO_TOKEN_LOCAL_STORAGE_KEY = 'radio-auth-token'

class Authentication {
  constructor() {
    this.radioToken = null
    this.askingForLogin = false

    this.radioTokenListeners = []
    this.askingForLoginListeners = []
  }

  initialize() {
    hybrid.appLoaded().then((radioToken) => {
      if (radioToken) {
        this.setToken(radioToken)
      }
    })
    hybrid.on('authenticated', ({ radioToken }) => this.setToken(radioToken))
    onLocalStorageChange(RADIO_TOKEN_LOCAL_STORAGE_KEY, (token) => this.setToken(token), true)
  }

  markAskingForLogin(state) {
    this.askingForLogin = state
    this.askingForLoginListeners.forEach((listener) => listener(state))
  }

  setToken(token) {
    this.radioToken = token

    api.setRadioToken(token)

    if (token) {
      this.markAskingForLogin(false)
    }

    this.radioTokenListeners.forEach((listener) => listener(token))
  }

  askForLogin() {
    this.markAskingForLogin(true)

    if (import.meta?.env?.DEV) {
      this.setToken(prompt('[DEVELOPMENT] Please enter your radio token:'))
    } else if (hybrid.isNativeApp()) {
      hybrid.call('showAuthentication', { tier: 'light' })
    } else {
      window.location.href = '/login'
    }
  }

  /**
   * Ensure that the user is authenticated by awaiting this method.
   *
   * Example usage:
   *
   * ```js
   * await authentication.require()
   * like(track)
   * ```
   **/
  require() {
    if (this.radioToken) {
      return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
      const onCompletion = () => (this.radioToken ? resolve() : reject('There is no authenticated user.'))
      this.onRadioTokenChange(onCompletion)
      this.askingForLoginListeners.push(onCompletion)

      this.askForLogin()
    })
  }

  isLoggedIn() {
    return !!this.radioToken
  }

  onRadioTokenChange(listener) {
    this.radioTokenListeners.push(listener)
  }

  onLogin(listener) {
    this.onRadioTokenChange(() => {
      if (this.radioToken) {
        listener()
      }
    })
  }
}

export default new Authentication()

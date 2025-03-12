import api from '../api/api.js'
import hybrid from './hybrid.js'
import { onLocalStorageChange } from '../utils/onLocalStorageChange.js'

export const RADIO_TOKEN_LOCAL_STORAGE_KEY = 'radio-auth-token'

const inDevelopment = () => {
  try {
    return import.meta.env?.DEV
  } catch (error) {
    return false
  }
}

class Authentication {
  constructor() {
    this.radioToken = null
    this.askingForLogin = false

    this.radioTokenListeners = []
    this.askingForLoginListeners = []
  }

  initialize() {
    hybrid
      .appLoaded()
      .then((radioToken) => {
        if (radioToken) {
          this.setToken(radioToken)
        }
      })
      .catch(() => {}) // We don't have to do anything if there is no radio token at app load
    hybrid.on('authenticated', ({ radioToken }) => {
      this.setToken(radioToken)
    })
    // When a user logs in or out in another view of the app than the one we're currently in,
    // we need to update the token once the user returns to this view.
    hybrid.on('didAppear', ({ radioToken }) => {
      this.setToken(radioToken ?? null)
    })
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

    if (inDevelopment()) {
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
      this.askingForLoginListeners.push((askingForLogin) => {
        if (!askingForLogin) {
          onCompletion()
        }
      })

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

  async refreshToken() {
    if (hybrid.isNativeApp()) {
      const updatedToken = Promise.race([
        new Promise((resolve) => {
          hybrid.on('authenticated', (token) => resolve(token))
        }),
        new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Timeout: no token received')), 2000)
        }),
      ])

      hybrid.call('refreshExpiredToken')

      return (await updatedToken).radioToken
    } else {
      try {
        const response = await fetch('/login/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const token = (await response.json()).radioToken
        localStorage.setItem(RADIO_TOKEN_LOCAL_STORAGE_KEY, token)
        return token
      } catch (e) {
        localStorage.removeItem(RADIO_TOKEN_LOCAL_STORAGE_KEY)
        throw e
      }
    }
  }
}

export default new Authentication()

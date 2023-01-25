export { default as hybrid } from './app/hybrid'

export { default as privacy } from './privacy/privacy'
export { default as dataLayer } from './privacy/dataLayer'

export { default as loadScript } from './utils/loadScript'
export { default as openLink } from './utils/openLink'

export { Q as Sock } from './q-sock'

// TODO: Replace with new API client implementation based on fetch
import axios from 'axios'
export function apiClient(baseURL) {
  const apiInstance = axios.create({
    baseURL,
  })

  apiInstance.interceptors.request.use((config) => {
    if (config.appAuth) {
      const { radioToken, signature_date, uid, uid_signature } = config.appAuth
      if (radioToken) {
        config.headers.Authorization = `Bearer ${radioToken}`
      } else if (uid) {
        config.params = { uid, signature_date, uid_signature, ...config.params }
      } else {
        throw new Error('No currentUserToken available')
      }
    }

    return config
  })

  return apiInstance
}

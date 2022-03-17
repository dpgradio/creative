import {Q} from './q-sock'
import hybrid from './src/utils/hybrid'
import openLink from './src/utils/openLink'
import Shareable from './src/share/Shareable'
import ImageGeneratorProperties from './src/share/ImageGeneratorProperties'
import ShareResult from './src/share/ShareResult'
import axios from "axios"

let Sock = Q

function apiClient(baseURL) {
  const apiInstance = axios.create({
    baseURL
  })

  apiInstance.interceptors.request.use(config => {
    if (config.appAuth) {
      const {radioToken, signature_date, uid, uid_signature} = config.appAuth
      if (radioToken) {
        config.headers.Authorization = `Bearer ${radioToken}`
      } else if (uid) {
        config.params = {uid, signature_date, uid_signature, ...config.params}
      } else {
        throw new Error("No currentUserToken available")
      }
    }
  
    return config
  })

  return apiInstance
}

export {
  Sock,
  apiClient,
  // Utilities
  hybrid,
  openLink,
  // Share
  // TODO: make share and utils importable separately, only when needed
  Shareable,
  ImageGeneratorProperties,
  ShareResult,
}

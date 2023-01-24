import axios from "axios"
import {Q} from '../q-sock'
import hybrid from './utils/hybrid'
import dataLayer from './utils/dataLayer'
import openLink from './utils/openLink'

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
  hybrid,
  dataLayer,
  openLink,
}

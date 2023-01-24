// From: https://github.com/medialaan/radio-radioplayer-frontend/blob/develop/src/general/utils/loadScript.js
// TODO: Refactor

export default function loadScript(url, { timeout = undefined } = {}) {
  return new Promise((resolve, reject) => {
    let script = document.createElement('script')
    const firstScript = document.getElementsByTagName('script')[0]
    script.async = true
    script.defer = true

    const loadScriptTimeout = timeout ? setTimeout(() => reject(`Loading script [${url}] blocked.`), timeout) : null

    const readyHandler = (_, isAbort) => {
      if (isAbort) {
        reject()
      } else {
        setTimeout(() => {
          clearTimeout(loadScriptTimeout)
          resolve()
        }, 0)
      }
    }

    script.onload = script.onreadystatechange = readyHandler
    script.src = url
    firstScript.parentNode.insertBefore(script, firstScript)
  })
}

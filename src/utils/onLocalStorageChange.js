const getLocalStorageItem = (key) => {
  try {
    return localStorage.getItem(key)
  } catch (error) {
    // Ignore error: either localStorage is disabled or full
    console.error(error)
    return undefined
  }
}

export const onLocalStorageChange = (key, callback, immediate) => {
  window.addEventListener('storage', (change) => {
    if (change.key == key) {
      callback(change.newValue)
    }
  })

  if (immediate) {
    callback(getLocalStorageItem(key))
  }
}

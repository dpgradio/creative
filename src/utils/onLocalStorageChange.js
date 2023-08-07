export const onLocalStorageChange = (key, callback, immediate) => {
  window.addEventListener('storage', (change) => {
    if (change.key == key) {
      callback(change.newValue)
    }
  })

  if (immediate) {
    callback(localStorage.getItem(key))
  }
}

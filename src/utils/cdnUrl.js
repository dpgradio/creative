const baseUrl = 'https://cdn-radio.dpgmedia.net'

export const cdnImageUrl = (endpoint, size = 'w480') => {
  if (!endpoint) {
    return null
  }
  return `${baseUrl}/site/${size}/${endpoint}`
}

export const cdnUrl = (endpoint) => {
  return `${baseUrl}/${endpoint}`
}

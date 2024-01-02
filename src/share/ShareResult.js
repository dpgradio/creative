import openExternalUrl from '../utils/openExternalUrl.js'

export default class ShareResult {
  constructor(shareable, { url, image }) {
    this.shareable = shareable
    this.url = url
    this.image = image
  }

  facebookUrl() {
    return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.url)}`
  }

  whatsappUrl() {
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(this.shareable.messageText)}%20${this.url}`
  }

  instagramUrl() {
    return this.image
  }

  openFacebookUrl() {
    openExternalUrl(this.facebookUrl())
  }

  openWhatsappUrl() {
    openExternalUrl(this.whatsappUrl())
  }

  openInstagramUrl() {
    openExternalUrl(this.instagramUrl())
  }
}
